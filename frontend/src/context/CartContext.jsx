import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const CartContext = createContext();

const API_BASE = 'https://paidhu-final-anm2.vercel.app';

// Safe localStorage wrappers to prevent exceptions when disk is full or storage is disabled
const safeGetItem = (key) => {
  try {
    return localStorage.getItem(key);
  } catch (e) {
    console.error("Failed to read localStorage", e);
    return null;
  }
};

const safeSetItem = (key, val) => {
  try {
    localStorage.setItem(key, val);
  } catch (e) {
    console.error("Failed to write to localStorage", e);
  }
};

const safeRemoveItem = (key) => {
  try {
    localStorage.removeItem(key);
  } catch (e) {
    console.error("Failed to remove from localStorage", e);
  }
};

// Helper to generate or load persistent guest client UUID
const getGuestId = () => {
  let guestId = safeGetItem('paidhu_guest_id');
  if (!guestId) {
    guestId = 'guest_' + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    safeSetItem('paidhu_guest_id', guestId);
  }
  return guestId;
};

// Formatter for Cart Items coming from the database
const formatBackendCartItem = (item) => {
  const p = item.product;
  if (!p) return null;

  let selectedVariant = null;
  if (item.variant && item.variant !== 'default') {
    let variantsList = [];
    try {
      variantsList = typeof p.variants === 'string' ? JSON.parse(p.variants) : (p.variants || []);
    } catch {}
    const matchingVariant = Array.isArray(variantsList) ? variantsList.find(v => v.size === item.variant) : null;
    selectedVariant = matchingVariant || { size: item.variant, price: p.price, offerPrice: p.discountPrice };
  }

  const basePrice = selectedVariant ? Number(selectedVariant.price) : Number(p.price);
  const discountPrice = selectedVariant 
    ? (selectedVariant.offerPrice ? Number(selectedVariant.offerPrice) : null)
    : (p.discountPrice ? Number(p.discountPrice) : null);

  return {
    id: Number(p.id),
    name: p.name,
    price: basePrice,
    offerPrice: discountPrice,
    image: p.image,
    category: p.category?.name || p.category || 'Uncategorized',
    shortDescription: p.shortDescription || p.description,
    selectedVariant,
    quantity: item.quantity
  };
};

// Formatter for Wishlist Items coming from the database
const formatBackendWishlistItem = (item) => {
  const p = item.product;
  if (!p) return null;
  return {
    id: Number(p.id),
    name: p.name,
    price: p.price,
    offerPrice: p.discountPrice,
    image: p.image,
    category: p.category?.name || p.category || 'Uncategorized',
    shortDescription: p.shortDescription || p.description
  };
};

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [cartBadgeAnimate, setCartBadgeAnimate] = useState(false);
  const [toasts, setToasts] = useState([]);
  const [token, setToken] = useState(safeGetItem('paidhu_token') || '');
  const [isCartLoaded, setIsCartLoaded] = useState(false);

  // Toast notifier helper
  const showToast = (message, type = 'success') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3000);
  };

  // Auth Initialization (Auto-login persistent guest session)
  useEffect(() => {
    const initAuth = async () => {
      let activeToken = token;
      if (!activeToken) {
        try {
          const guestId = getGuestId();
          const res = await fetch(`${API_BASE}/api/users/guest-login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ guestId })
          });
          if (res.ok) {
            const data = await res.json();
            activeToken = data.token;
            safeSetItem('paidhu_token', activeToken);
            setToken(activeToken);
          } else {
            setIsCartLoaded(true);
          }
        } catch (err) {
          console.error('Auth initialization failed:', err);
          setIsCartLoaded(true);
        }
      }
    };
    initAuth();
  }, [token]);

  // Fetch Cart and Wishlist from Database on startup/token refresh
  useEffect(() => {
    if (!token) {
      setIsCartLoaded(true);
      return;
    }

    const fetchInitialData = async () => {
      try {
        const cartRes = await fetch(`${API_BASE}/api/cart`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (cartRes.status === 401) {
          safeRemoveItem('paidhu_token');
          setToken('');
          setIsCartLoaded(true);
          return;
        }
        if (cartRes.ok) {
          const data = await cartRes.json();
          if (isMutatingRef.current === 0) {
            setCart(data.map(formatBackendCartItem).filter(Boolean));
          }
        }

        const wishlistRes = await fetch(`${API_BASE}/api/wishlist`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (wishlistRes.status === 401) {
          safeRemoveItem('paidhu_token');
          setToken('');
          setIsCartLoaded(true);
          return;
        }
        if (wishlistRes.ok) {
          const data = await wishlistRes.json();
          setWishlist(data.map(formatBackendWishlistItem).filter(Boolean));
        }
      } catch (err) {
        console.error('Error fetching initial cart/wishlist:', err);
      } finally {
        setIsCartLoaded(true);
      }
    };

    fetchInitialData();
  }, [token]);

  const isAddingRef = useRef(new Set());
  const isMutatingRef = useRef(0);

  // Cart Operations
  const addToCart = async (product, quantity = 1, selectedVariant = null) => {
    if (!token) return;
    const previousCart = [...cart];
    const variantSize = selectedVariant?.size || 'default';
    
    // Prevent duplicate concurrent requests for the same product+variant
    const itemKey = `${Number(product.id)}-${variantSize}`;
    if (isAddingRef.current.has(itemKey)) return;
    isAddingRef.current.add(itemKey);
    isMutatingRef.current += 1;

    // Optimistically update React cart state
    setCart(prevCart => {
      const existingItemIndex = prevCart.findIndex(
        item => Number(item.id) === Number(product.id) && (item.selectedVariant?.size || 'default') === variantSize
      );
      if (existingItemIndex > -1) {
        const newCart = [...prevCart];
        newCart[existingItemIndex] = {
          ...newCart[existingItemIndex],
          quantity: newCart[existingItemIndex].quantity + quantity
        };
        return newCart;
      } else {
        const newItem = {
          id: Number(product.id),
          name: product.name,
          price: selectedVariant ? Number(selectedVariant.price) : Number(product.price),
          offerPrice: selectedVariant 
            ? (selectedVariant.offerPrice ? Number(selectedVariant.offerPrice) : null)
            : (product.discountPrice ? Number(product.discountPrice) : null),
          image: product.image,
          category: product.category?.name || product.category || 'Uncategorized',
          shortDescription: product.shortDescription || product.description,
          selectedVariant,
          quantity: quantity
        };
        return [...prevCart, newItem];
      }
    });

    setCartBadgeAnimate(true);
    showToast('Product added to cart', 'success');

    try {
      const res = await fetch(`${API_BASE}/api/cart/add`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          productId: Number(product.id),
          quantity,
          variant: variantSize
        })
      });

      if (res.status === 401) {
        safeRemoveItem('paidhu_token');
        setToken('');
        setCart(previousCart);
        return;
      }

      if (res.ok) {
        // Silent background sync
        const cartRes = await fetch(`${API_BASE}/api/cart`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (cartRes.ok) {
          const data = await cartRes.json();
          if (isMutatingRef.current === 1) {
            setCart(data.map(formatBackendCartItem).filter(Boolean));
          }
        }
      } else {
        setCart(previousCart);
        showToast('Failed to add product to database', 'error');
      }
    } catch (err) {
      console.error('Add to cart failed:', err);
      setCart(previousCart);
      showToast('Failed to add product', 'error');
    } finally {
      isAddingRef.current.delete(itemKey);
      isMutatingRef.current = Math.max(0, isMutatingRef.current - 1);
    }
  };

  const removeFromCart = async (productId, variantSize = null) => {
    if (!token) return;
    const previousCart = [...cart];
    const targetVariant = variantSize || 'default';
    isMutatingRef.current += 1;

    // Optimistically remove item from React cart state
    setCart(prevCart => prevCart.filter(
      item => !(Number(item.id) === Number(productId) && (item.selectedVariant?.size || 'default') === targetVariant)
    ));
    showToast('Removed from cart', 'success');

    try {
      const res = await fetch(`${API_BASE}/api/cart/remove`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify({
          productId: Number(productId),
          variant: targetVariant
        })
      });

      if (res.status === 401) {
        safeRemoveItem('paidhu_token');
        setToken('');
        setCart(previousCart);
        return;
      }

      if (res.ok) {
        // Silent background sync
        const cartRes = await fetch(`${API_BASE}/api/cart`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (cartRes.ok) {
          const data = await cartRes.json();
          if (isMutatingRef.current === 1) {
            setCart(data.map(formatBackendCartItem).filter(Boolean));
          }
        }
      } else {
        setCart(previousCart);
        showToast('Failed to remove product from server', 'error');
      }
    } catch (err) {
      console.error('Remove from cart failed:', err);
      setCart(previousCart);
      showToast('Failed to remove product', 'error');
    } finally {
      isMutatingRef.current = Math.max(0, isMutatingRef.current - 1);
    }
  };

  const updateQuantity = async (productId, quantity, variantSize = null) => {
    if (!token) return;
    if (quantity <= 0) {
      await removeFromCart(productId, variantSize);
      return;
    }

    const previousCart = [...cart];
    const targetVariant = variantSize || 'default';
    isMutatingRef.current += 1;

    // Optimistically update item quantity in React cart state
    setCart(prevCart => prevCart.map(item => {
      if (Number(item.id) === Number(productId) && (item.selectedVariant?.size || 'default') === targetVariant) {
        return { ...item, quantity };
      }
      return item;
    }));

    try {
      const res = await fetch(`${API_BASE}/api/cart/update`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          productId: Number(productId),
          quantity,
          variant: targetVariant
        })
      });

      if (res.status === 401) {
        safeRemoveItem('paidhu_token');
        setToken('');
        setCart(previousCart);
        return;
      }

      if (res.ok) {
        // Silent background sync
        const cartRes = await fetch(`${API_BASE}/api/cart`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (cartRes.ok) {
          const data = await cartRes.json();
          if (isMutatingRef.current === 1) {
            setCart(data.map(formatBackendCartItem).filter(Boolean));
          }
        }
      } else {
        setCart(previousCart);
        showToast('Failed to update quantity', 'error');
      }
    } catch (err) {
      console.error('Update quantity failed:', err);
      setCart(previousCart);
    } finally {
      isMutatingRef.current = Math.max(0, isMutatingRef.current - 1);
    }
  };

  const clearCart = async () => {
    if (!token) return;
    const previousCart = [...cart];
    setCart([]);
    showToast('Cart cleared', 'success');
    isMutatingRef.current += 1;

    try {
      const res = await fetch(`${API_BASE}/api/cart/clear`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (res.status === 401) {
        safeRemoveItem('paidhu_token');
        setToken('');
        setCart(previousCart);
        return;
      }
    } catch (err) {
      console.error('Clear cart failed:', err);
      setCart(previousCart);
    } finally {
      isMutatingRef.current = Math.max(0, isMutatingRef.current - 1);
    }
  };

  // Wishlist Operations
  const toggleWishlist = async (product) => {
    if (!token) return;
    
    const previousWishlist = [...wishlist];
    const isInWish = wishlist.some(item => Number(item.id) === Number(product.id));
    
    // Optimistically update local state immediately
    if (isInWish) {
      setWishlist(wishlist.filter(item => Number(item.id) !== Number(product.id)));
      showToast('Removed from wishlist', 'success');
    } else {
      const newItem = {
        id: product.id,
        name: product.name,
        price: product.price,
        offerPrice: product.offerPrice,
        image: product.image || (product.productImages && product.productImages.length > 0 ? product.productImages[0].imageUrl : null),
        slug: product.slug,
        raw: product
      };
      setWishlist([...wishlist, newItem]);
      showToast('Added to wishlist', 'success');
    }

    try {
      const res = await fetch(`${API_BASE}/api/wishlist/toggle`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ productId: Number(product.id) })
      });
      if (res.status === 401) {
        safeRemoveItem('paidhu_token');
        setToken('');
        setWishlist(previousWishlist);
        return;
      }
      if (!res.ok) {
        throw new Error('Toggle API call failed');
      }
      
      // Perform a silent background sync of the wishlist to ensure client/server consistency
      const wishlistRes = await fetch(`${API_BASE}/api/wishlist`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (wishlistRes.ok) {
        const wishlistData = await wishlistRes.json();
        setWishlist(wishlistData.map(formatBackendWishlistItem).filter(Boolean));
      }
    } catch (err) {
      console.error('Toggle wishlist failed:', err);
      showToast('Failed to update wishlist', 'error');
      // Rollback on error
      setWishlist(previousWishlist);
    }
  };

  const removeFromWishlist = async (productId) => {
    if (!token) return;
    
    const previousWishlist = [...wishlist];
    
    // Optimistically update local state immediately
    setWishlist(wishlist.filter(item => Number(item.id) !== Number(productId)));
    showToast('Removed from wishlist', 'success');
    
    try {
      const res = await fetch(`${API_BASE}/api/wishlist/${Number(productId)}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.status === 401) {
        safeRemoveItem('paidhu_token');
        setToken('');
        setWishlist(previousWishlist);
        return;
      }
      if (!res.ok) {
        throw new Error('Remove API call failed');
      }
      
      // Silent sync with server in background
      const wishlistRes = await fetch(`${API_BASE}/api/wishlist`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (wishlistRes.ok) {
        const data = await wishlistRes.json();
        setWishlist(data.map(formatBackendWishlistItem).filter(Boolean));
      }
    } catch (err) {
      console.error('Remove from wishlist failed:', err);
      // Rollback on error
      setWishlist(previousWishlist);
    }
  };

  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  const cartTotal = cart.reduce((acc, item) => {
    const itemPrice = item.offerPrice || item.price;
    return acc + (itemPrice * item.quantity);
  }, 0);

  return (
    <CartContext.Provider value={{
      cart,
      isCartOpen,
      setIsCartOpen,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      cartCount,
      cartTotal,
      isCartLoaded,
      cartBadgeAnimate,
      setCartBadgeAnimate,
      // Wishlist
      wishlist,
      isWishlistOpen,
      setIsWishlistOpen,
      toggleWishlist,
      removeFromWishlist,
      wishlistCount: wishlist.length,
      // Toasts
      showToast
    }}>
      {children}

      {/* Floating toast notifications */}
      <div className="fixed bottom-5 right-5 z-[99999] flex flex-col gap-3 max-w-sm pointer-events-none">
        <AnimatePresence>
          {toasts.map(t => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: 20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.9 }}
              transition={{ type: 'spring', damping: 25, stiffness: 350 }}
              className={`pointer-events-auto flex items-center gap-3 px-5 py-3.5 rounded-2xl shadow-xl text-white text-sm font-semibold border ${
                t.type === 'error' 
                  ? 'bg-rose-600 border-rose-500 shadow-rose-900/10' 
                  : 'bg-[#1a2b3c] border-[#2c3e50] shadow-[#1a2b3c]/20'
              }`}
            >
              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-xs ${
                t.type === 'error' ? 'bg-white text-rose-600' : 'bg-[#662654] text-white'
              }`}>
                {t.type === 'error' ? '!' : '✓'}
              </span>
              <span className="flex-1">{t.message}</span>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

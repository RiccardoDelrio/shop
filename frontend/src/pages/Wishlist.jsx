import { Link } from 'react-router-dom';
import { useGlobal } from '../contexts/GlobalContext';
import './Wishlist.css'; // Create this file for custom styles
import { useEffect } from 'react';

export default function Wishlist() {
    const { wishlistItems, setWishlistItems, toggleWishlist, isInWishlist, setIsInWishlist, isInWishlistPage, setIsInWishlistPage } = useGlobal()

    const user = JSON.parse(localStorage.getItem('user'))
    const token = localStorage.getItem('token')
    useEffect(() => {
        setIsInWishlistPage(wishlistItems.map(item => {
            return item.product_id || item.id
        }))



    }, [])



    const handleRemoveWishList = (itemId) => {
        const indexOfItem = wishlistItems.indexOf()
        if (user?.id && token) {

            fetch(`http://localhost:3000/api/v1/wishlist/${itemId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            })
                .then(res => res.json())
                .then(data => {
                    console.log(data.message || data.error)

                    const indexOfItem = isInWishlistPage.indexOf(itemId)
                    setIsInWishlistPage(isInWishlistPage.splice(indexOfItem, 1))



                }

                )
        }


    }











    return (
        <div className="container py-5">
            <h2 className="mb-4">My Wishlist</h2>

            {wishlistItems.length === 0 ? (
                <div className="text-center">
                    <p>Your wishlist is empty</p>
                    <Link to="/search" className="btn btn-primary">
                        Continue Shopping
                    </Link>
                </div>
            ) : (
                <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-xl-4  g-2">
                    {wishlistItems?.map((item) => (
                        <div key={item.id} className="col">
                            <div className="card h-100 wishlist-card">
                                <div className="wishlist-img-container">
                                    <img
                                        src={item.selectedImage || `http://localhost:3000/imgs/${item.images[0].url}`}
                                        className="card-img-top wishlist-img"
                                        alt={item.name}
                                    />
                                </div>
                                <div className="card-body">
                                    <h5 className="card-title text-truncate">{item.name}</h5>
                                    <div className="selected-variants mb-2">
                                        <span className="badge bg-light text-dark me-2">
                                            Color: {item.selectedColor}
                                        </span>
                                        <span className="badge bg-light text-dark">
                                            Size: {item?.selectedVariation?.size}
                                        </span>
                                    </div>
                                    <p className="card-text">€ {item.price}</p>
                                    <div className="d-flex justify-content-between">                                        <Link
                                        to={`/product/${item.slug}`}
                                        className="btn btn-primary btn-sm"
                                    >
                                        View Details
                                    </Link>
                                        <button
                                            onClick={() => handleRemoveWishList(item.product_id || item.id)}
                                            className="btn btn-outline-danger btn-sm"
                                        >
                                            <i className="bi bi-heart-fill"></i>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
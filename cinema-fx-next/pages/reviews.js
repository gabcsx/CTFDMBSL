// pages/reviews.js
import { useState, useEffect } from 'react';
import Head from 'next/head';
import Image from 'next/image';
import Header from '../components/Header';

export default function Reviews() {
    const [filteredReviews, setFilteredReviews] = useState([]);
    const [sortBy, setSortBy] = useState('newest');
    const [selectedRating, setSelectedRating] = useState('all');
    const [showPhotosOnly, setShowPhotosOnly] = useState(false);

    // Sample reviews data - 4 five-stars, 4 four-stars, 2 three-stars
    const allReviews = [
        // 5-star reviews (4)
        {
            id: 1,
            customerName: 'carolayman',
            productName: 'Bright Boost B12 Serum, Centella Asiatica CICA Allantoin',
            rating: 5,
            date: '2025-05-25',
            title: ' ',
            review: 'I received the parcel today, thank u sa buy 1 take 1. First time to try sna effective.',
            verified: true,
            helpful: 24,
            avatar: '/assets/anon.png',
            photos: ['/assets/c1p1.webp'],
            variant: '30ml',
            likes: 24
        },
        {
            id: 2,
            customerName: 'cindyrepasa',
            productName: 'VITAMIN C SKIN BOOSTER',
            rating: 5,
            date: '2025-05-25',
            title: ' ',
            review: ' ',
            verified: true,
            helpful: 18,
            avatar: '/assets/c2pic.webp',
            photos: [],
            variant: '30ml',
            likes: 18
        },
        {
            id: 3,
            customerName: 'mariahazelbautista210',
            productName: 'Magic Jeju Soap',
            rating: 5,
            date: '2025-05-25',
            title: 'Highly recommended. Worth it',
            review: 'been using since it was introduced. made my skin smoother.',
            verified: true,
            helpful: 22,
            avatar: '/assets/anon.png',
            photos: [ ],
            variant: '135g',
            likes: 22
        },
        {
            id: 4,
            customerName: 'v*****s',
            productName: 'Eye Collagen',
            rating: 5,
            date: '2025-05-23',
            title: 'Nice Scent',
            review: 'anti-aging for eye, reduces eye puffiness and black under eye. Thank you Ms. Che for the free glassier me soap.',
            verified: true,
            helpful: 25,
            avatar: '/assets/anon.png',
            photos: ['/assets/c4p1.webp', '/assets/c4p2.webp', '/assets/c4p3.webp', '/assets/c4p4.webp', '/assets/c4p5.webp'],
            variant: '20ml',
            likes: 25
        },
        // 4-star reviews (4)
        {
            id: 5,
            customerName: 'm******1',
            productName: 'Centella Asiatica CICA Allantoin',
            rating: 4,
            date: '2025-05-23',
            title: ' ',
            review: ' ',
            verified: true,
            helpful: 15,
            avatar: '/assets/anon.png',
            photos: ['/assets/c5p1.webp'],
            variant: '30ml',
            likes: 15
        },
        {
            id: 6,
            customerName: 'a*****o',
            productName: 'Bright Boost B12 Serum',
            rating: 4,
            date: '2025-05-20',
            title: ' ',
            review: 'Thank u po seller fast shipping and  shopee free sf  slmt and buy 1 take 1 hope hiyang ko para worth the price nmn safe packaging maayos at mbilis sa sabon gulat ako hehe liit lng pala sana worth the price will edit dis once works for me',
            verified: true,
            helpful: 12,
            avatar: '/assets/anon.png',
            photos: ['/assets/c6p1.webp'],
            variant: '30ml',
            likes: 12
        },
        {
            id: 7,
            customerName: 'g*****i',
            productName: 'Follicle Revive',
            rating: 4,
            date: '2025-01-03',
            title: 'Smells Good',
            review: 'I am not sure how effective would this be since I am only using this for few weeks but it looks promising since may biotin, rosemary and minoxidil ingredients which I know na effective for hair regrowth and the very reasons why napa check out ako neto.',
            verified: true,
            helpful: 19,
            avatar: '/assets/anon.png',
            photos: ['/assets/c7p1.webp'],
            variant: '50ml',
            likes: 19
        },
        {
            id: 8,
            customerName: 'z*****7',
            productName: 'Crush Blush "LOVED"',
            rating: 4,
            date: '2024-12-28',
            title: 'Well packed as always',
            review: 'Good deals, Pls. Improve texts on ingui. Hindi lang mabasa. Excited sa collection ko ng ccfx. Will order again soon. Thanks God Bless.',
            verified: true,
            helpful: 8,
            avatar: '/assets/avatar7.jpg',
            photos: ['/assets/c8p1.webp','/assets/c8p2.webp', '/assets/c8p3.webp', '/assets/c8p4.webp', '/assets/c8p5.webp'],
            variant: '30ml',
            likes: 8
        },
        // 3-star reviews (2)
        {
            id: 9,
            customerName: 'c*****e',
            productName: 'Magic Jeju Soap',
            rating: 3,
            date: '2024-12-20',
            title: 'packed well',
            review: 'Okay naman yung item but i guess hiyangan lang talaga. I have a sensitive skin. Mas kumate yung skin ko sa soap.. Hence tinigil ko muna aa per advise na din ni cs.',
            verified: true,
            helpful: 7,
            avatar: '/assets/anon.png',
            photos: ['/assets/c9p1.webp'],
            variant: '30ml',
            likes: 7
        },
        {
            id: 10,
            customerName: 'David Lim',
            productName: 'Magic White Sepi',
            rating: 3,
            date: '2024-12-15',
            title: 'there is no scent',
            review: 'I hope it will be effective. Have been using it 2x a day for 2 weeks now but there is not much effect.',
            verified: true,
            helpful: 5,
            avatar: '/assets/avatar8.jpg',
            photos: ['/assets/c10p1.webp'],
            variant: '30ml',
            likes: 5
        }
    ];

    // Filter and sort reviews
    useEffect(() => {
        let filtered = allReviews.filter(review => {
            const matchesRating = selectedRating === 'all' || review.rating === parseInt(selectedRating);
            const matchesPhotos = !showPhotosOnly || review.photos.length > 0;
            return matchesRating && matchesPhotos;
        });

        // Sort reviews
        filtered.sort((a, b) => {
            switch (sortBy) {
                case 'oldest':
                    return new Date(a.date) - new Date(b.date);
                case 'highest-rating':
                    return b.rating - a.rating;
                case 'lowest-rating':
                    return a.rating - b.rating;
                case 'most-helpful':
                    return b.helpful - a.helpful;
                case 'newest':
                default:
                    return new Date(b.date) - new Date(a.date);
            }
        });

        setFilteredReviews(filtered);
    }, [sortBy, selectedRating, showPhotosOnly]);

    // Calculate overall statistics
    const getOverallStats = () => {
        const totalReviews = allReviews.length;
        const averageRating = allReviews.reduce((sum, review) => sum + review.rating, 0) / totalReviews;
        const ratingDistribution = [5, 4, 3, 2, 1].map(rating => 
            allReviews.filter(review => review.rating === rating).length
        );
        
        return { totalReviews, averageRating, ratingDistribution };
    };

    const { totalReviews, averageRating, ratingDistribution } = getOverallStats();

    const renderStars = (rating) => {
        return Array.from({ length: 5 }, (_, index) => (
            <span key={index} className={`star ${index < rating ? 'filled' : ''}`}>
                ★
            </span>
        ));
    };

    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString('en-US', options);
    };

    const handleLikeClick = (reviewId) => {
        alert('Thank you for your feedback!');
    };

    return (
        <>
            <Head>
                <title>Customer Reviews - Cinema SkinFX</title>
                <meta name="description" content="Read authentic customer reviews and ratings for Cinema SkinFX products" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
            </Head>

            <Header />

            <main className="reviews-page">
                {/* Hero Section */}
                <section className="reviews-hero">
                    <div className="container">
                        <h1>Customer Reviews</h1>
                        <p>Real experiences from our valued customers</p>
                    </div>
                </section>

                {/* Overall Statistics */}
                <section className="stats-section">
                    <div className="container">
                        <div className="stats-container">
                            <div className="overall-rating">
                                <div className="rating-number">{averageRating.toFixed(1)}</div>
                                <div className="rating-stars">
                                    {renderStars(Math.round(averageRating))}
                                </div>
                                <div className="total-reviews">({totalReviews} Reviews)</div>
                            </div>
                            
                            <div className="rating-breakdown">
                                {[5, 4, 3, 2, 1].map((rating, index) => (
                                    <div key={rating} className="rating-row">
                                        <span className="rating-label">{rating}</span>
                                        <div className="rating-stars-small">
                                            {renderStars(rating)}
                                        </div>
                                        <div className="rating-bar">
                                            <div 
                                                className="rating-fill"
                                                style={{ 
                                                    width: `${(ratingDistribution[index] / totalReviews) * 100}%` 
                                                }}
                                            ></div>
                                        </div>
                                        <span className="rating-count">({ratingDistribution[index]})</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>

                {/* Filters Section - Shopee Style (without product filter) */}
                <section className="filters-section">
                    <div className="container">
                        <div className="filter-tabs">
                            <div className="filter-row">
                                <span className="filter-label">Rating:</span>
                                <div className="filter-buttons">
                                    <button
                                        className={`filter-btn ${selectedRating === 'all' ? 'active' : ''}`}
                                        onClick={() => setSelectedRating('all')}
                                    >
                                        All
                                    </button>
                                    {[5, 4, 3, 2, 1].map(rating => (
                                        <button
                                            key={rating}
                                            className={`filter-btn ${selectedRating === rating.toString() ? 'active' : ''}`}
                                            onClick={() => setSelectedRating(rating.toString())}
                                        >
                                            {rating} ★
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="filter-row">
                                <span className="filter-label">Options:</span>
                                <div className="filter-buttons">
                                    <button
                                        className={`filter-btn ${showPhotosOnly ? 'active' : ''}`}
                                        onClick={() => setShowPhotosOnly(!showPhotosOnly)}
                                    >
                                        📷 With Photos
                                    </button>
                                </div>
                            </div>

                            <div className="sort-section">
                                <span className="filter-label">Sort by:</span>
                                <select
                                    value={sortBy}
                                    onChange={(e) => setSortBy(e.target.value)}
                                    className="sort-select"
                                >
                                    <option value="newest">Latest</option>
                                    <option value="oldest">Oldest</option>
                                    <option value="highest-rating">Highest Rating</option>
                                    <option value="lowest-rating">Lowest Rating</option>
                                    <option value="most-helpful">Most Helpful</option>
                                </select>
                            </div>
                        </div>

                        <div className="results-summary">
                            {filteredReviews.length} review{filteredReviews.length !== 1 ? 's' : ''} found
                        </div>
                    </div>
                </section>

                {/* Reviews List - Shopee Style */}
                <section className="reviews-list-section">
                    <div className="container">
                        {filteredReviews.length > 0 ? (
                            <div className="reviews-list">
                                {filteredReviews.map(review => (
                                    <div key={review.id} className="review-item">
                                        <div className="review-header">
                                            <div className="customer-section">
                                                <div className="customer-avatar">
                                                    <Image
                                                        src={review.avatar}
                                                        alt={review.customerName} 
                                                        width={40}
                                                        height={40}
                                                        objectFit="cover"
                                                        placeholder="blur"
                                                        blurDataURL="/assets/placeholder.png"
                                                    />
                                                </div>
                                                <div className="customer-info">
                                                    <div className="customer-name">{review.customerName}</div>
                                                    <div className="customer-meta">
                                                        <span className="review-date">{formatDate(review.date)}</span>
                                                        {review.verified && (
                                                            <span className="verified-purchase">✓ Verified Purchase</span>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="review-rating">
                                                {renderStars(review.rating)}
                                            </div>
                                        </div>

                                        <div className="review-body">
                                            <div className="product-variant">
                                                Product: <strong>{review.productName}</strong> - {review.variant}
                                            </div>
                                            
                                            <div className="review-content">
                                                <h4 className="review-title">{review.title}</h4>
                                                <p className="review-text">{review.review}</p>
                                            </div>

                                            {review.photos.length > 0 && (
                                                <div className="review-photos">
                                                    {review.photos.map((photo, index) => (
                                                        <div key={index} className="photo-thumbnail">
                                                            <Image
                                                                src={photo}
                                                                alt={`Review photo ${index + 1}`}
                                                                width={80}
                                                                height={80}
                                                                objectFit="cover"
                                                                placeholder="blur"
                                                                blurDataURL="/assets/placeholder.png"
                                                            />
                                                        </div>
                                                    ))}
                                                </div>
                                            )}

                                            <div className="review-actions">
                                                <button 
                                                    className="like-btn"
                                                    onClick={() => handleLikeClick(review.id)}
                                                >
                                                    👍 Helpful ({review.likes})
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="no-reviews">
                                <div className="no-reviews-icon">📝</div>
                                <h3>No reviews found</h3>
                                <p>Try adjusting your filters to see more reviews</p>
                            </div>
                        )}
                    </div>
                </section>
            </main>

            <footer>
                <p>&copy; 2025 Cinema SkinFX. Powered by CosmetiCore. All rights reserved.</p>
            </footer>

            {/* Keep all the same CSS styles from before */}
            <style jsx>{`
                /* All the same CSS styles as before - no changes needed */
                .reviews-page {
                    min-height: 100vh;
                }

                .reviews-hero {
                    background: linear-gradient(135deg, #e91e63, #c2185b);
                    color: white;
                    padding: 4rem 0;
                    text-align: center;
                }

                .reviews-hero h1 {
                    font-size: 3rem;
                    margin-bottom: 1rem;
                    font-weight: 700;
                }

                .reviews-hero p {
                    font-size: 1.2rem;
                    opacity: 0.9;
                }

                .stats-section {
                    background: white;
                    padding: 3rem 0;
                    border-bottom: 1px solid #eee;
                }

                .stats-container {
                    display: grid;
                    grid-template-columns: 1fr 2fr;
                    gap: 3rem;
                    align-items: center;
                }

                .overall-rating {
                    text-align: center;
                }

                .rating-number {
                    font-size: 4rem;
                    font-weight: 700;
                    color: #e91e63;
                    margin-bottom: 0.5rem;
                }

                .rating-stars {
                    font-size: 2rem;
                    color: #ffc107;
                    margin-bottom: 0.5rem;
                }

                .total-reviews {
                    color: #666;
                    font-size: 1rem;
                }

                .rating-breakdown {
                    display: flex;
                    flex-direction: column;
                    gap: 0.75rem;
                }

                .rating-row {
                    display: flex;
                    align-items: center;
                    gap: 1rem;
                }

                .rating-label {
                    min-width: 20px;
                    font-size: 0.9rem;
                    color: #666;
                    font-weight: 600;
                }

                .rating-stars-small {
                    font-size: 0.8rem;
                    color: #ffc107;
                    min-width: 80px;
                }

                .rating-bar {
                    flex: 1;
                    height: 8px;
                    background: #f0f0f0;
                    border-radius: 4px;
                    overflow: hidden;
                }

                .rating-fill {
                    height: 100%;
                    background: #ffc107;
                    transition: width 0.3s ease;
                }

                .rating-count {
                    min-width: 40px;
                    font-size: 0.85rem;
                    color: #666;
                    text-align: right;
                }

                .filters-section {
                    background: #f8f9fa;
                    padding: 2rem 0;
                    border-bottom: 1px solid #eee;
                }

                .filter-tabs {
                    display: flex;
                    flex-direction: column;
                    gap: 1.5rem;
                }

                .filter-row {
                    display: flex;
                    align-items: center;
                    gap: 1rem;
                    flex-wrap: wrap;
                }

                .filter-label {
                    font-weight: 600;
                    color: #333;
                    min-width: 100px;
                    font-size: 0.9rem;
                }

                .filter-buttons {
                    display: flex;
                    gap: 0.5rem;
                    flex-wrap: wrap;
                }

                .filter-btn {
                    padding: 0.5rem 1rem;
                    border: 1px solid #ddd;
                    background: white;
                    border-radius: 20px;
                    cursor: pointer;
                    font-size: 0.85rem;
                    transition: all 0.2s ease;
                    color: #666;
                }

                .filter-btn:hover {
                    border-color: #e91e63;
                    color: #e91e63;
                }

                .filter-btn.active {
                    background: #e91e63;
                    border-color: #e91e63;
                    color: white;
                }

                .sort-section {
                    display: flex;
                    align-items: center;
                    gap: 1rem;
                    margin-left: auto;
                }

                .sort-select {
                    padding: 0.5rem 1rem;
                    border: 1px solid #ddd;
                    border-radius: 6px;
                    font-size: 0.9rem;
                    background: white;
                }

                .sort-select:focus {
                    outline: none;
                    border-color: #e91e63;
                }

                .results-summary {
                    color: #666;
                    font-size: 0.9rem;
                    margin-top: 1rem;
                    padding-top: 1rem;
                    border-top: 1px solid #eee;
                }

                .reviews-list-section {
                    padding: 2rem 0;
                    background: #fafafa;
                }

                .reviews-list {
                    display: flex;
                    flex-direction: column;
                    gap: 1rem;
                }

                .review-item {
                    background: white;
                    border-radius: 8px;
                    padding: 1.5rem;
                    box-shadow: 0 1px 3px rgba(0,0,0,0.1);
                    transition: box-shadow 0.2s ease;
                }

                .review-item:hover {
                    box-shadow: 0 2px 8px rgba(0,0,0,0.15);
                }

                .review-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: flex-start;
                    margin-bottom: 1rem;
                }

                .customer-section {
                    display: flex;
                    gap: 0.75rem;
                    align-items: center;
                }

                .customer-avatar {
                    border-radius: 50%;
                    overflow: hidden;
                    flex-shrink: 0;
                }

                .customer-name {
                    font-weight: 600;
                    color: #333;
                    font-size: 0.95rem;
                    margin-bottom: 0.25rem;
                }

                .customer-meta {
                    display: flex;
                    gap: 1rem;
                    align-items: center;
                }

                .review-date {
                    color: #999;
                    font-size: 0.8rem;
                }

                .verified-purchase {
                    color: #4caf50;
                    font-size: 0.75rem;
                    font-weight: 500;
                }

                .review-rating {
                    font-size: 1rem;
                    color: #ffc107;
                }

                .review-body {
                    display: flex;
                    flex-direction: column;
                    gap: 1rem;
                }

                .product-variant {
                    color: #666;
                    font-size: 0.85rem;
                    padding: 0.5rem;
                    background: #f8f9fa;
                    border-radius: 4px;
                    border-left: 3px solid #e91e63;
                }

                .review-title {
                    font-size: 1.1rem;
                    color: #333;
                    margin: 0 0 0.5rem 0;
                    font-weight: 600;
                }

                .review-text {
                    color: #555;
                    line-height: 1.6;
                    font-size: 0.95rem;
                    margin: 0;
                }

                .review-photos {
                    display: flex;
                    gap: 0.5rem;
                    flex-wrap: wrap;
                }

                .photo-thumbnail {
                    border-radius: 6px;
                    overflow: hidden;
                    cursor: pointer;
                    transition: transform 0.2s ease;
                }

                .photo-thumbnail:hover {
                    transform: scale(1.05);
                }

                .review-actions {
                    display: flex;
                    justify-content: flex-end;
                    padding-top: 0.5rem;
                    border-top: 1px solid #f0f0f0;
                }

                .like-btn {
                    background: none;
                    border: 1px solid #ddd;
                    padding: 0.4rem 0.8rem;
                    border-radius: 16px;
                    cursor: pointer;
                    color: #666;
                    font-size: 0.8rem;
                    transition: all 0.2s ease;
                }

                .like-btn:hover {
                    background: #f8f9fa;
                    border-color: #ccc;
                }

                .star {
                    color: #ddd;
                }

                .star.filled {
                    color: #ffc107;
                }

                .no-reviews {
                    text-align: center;
                    padding: 4rem 2rem;
                    color: #666;
                }

                .no-reviews-icon {
                    font-size: 4rem;
                    margin-bottom: 1rem;
                }

                .no-reviews h3 {
                    font-size: 1.5rem;
                    margin-bottom: 0.5rem;
                    color: #444;
                }

                /* Mobile Responsiveness */
                @media (max-width: 768px) {
                    .reviews-hero h1 {
                        font-size: 2rem;
                    }

                    .stats-container {
                        grid-template-columns: 1fr;
                        gap: 2rem;
                    }

                    .filter-row {
                        flex-direction: column;
                        align-items: flex-start;
                        gap: 0.75rem;
                    }

                    .filter-label {
                        min-width: auto;
                    }

                    .sort-section {
                        margin-left: 0;
                        width: 100%;
                        justify-content: flex-start;
                    }

                    .review-header {
                        flex-direction: column;
                        gap: 0.75rem;
                        align-items: flex-start;
                    }

                    .customer-section {
                        width: 100%;
                    }

                    .review-item {
                        padding: 1rem;
                    }

                    .rating-number {
                        font-size: 3rem;
                    }

                    .rating-stars {
                        font-size: 1.5rem;
                    }
                }

                @media (max-width: 576px) {
                    .reviews-hero {
                        padding: 2rem 0;
                    }

                    .reviews-hero h1 {
                        font-size: 1.8rem;
                    }

                    .filter-buttons {
                        width: 100%;
                    }

                    .filter-btn {
                        flex: 1;
                        text-align: center;
                        min-width: 0;
                    }

                    .customer-section {
                        flex-direction: column;
                        text-align: center;
                        gap: 0.5rem;
                    }

                    .customer-meta {
                        justify-content: center;
                        flex-wrap: wrap;
                    }

                    .review-actions {
                        justify-content: center;
                    }
                }
            `}</style>
        </>
    );
}

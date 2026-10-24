export interface Review {
  id: number;
  productId: number;
  author: string;
  rating: number;
  date: string;
  title: string;
  comment: string;
  verified: boolean;
  size?: string;
}

const names = [
  'Aarav Sharma', 'Ananya Reddy', 'Vikram Patel', 'Priya Nair',
  'Rohan Mehta', 'Ishita Gupta', 'Karan Malhotra', 'Sneha Iyer',
  'Arjun Kapoor', 'Diya Joshi', 'Aditya Verma', 'Kavya Rao',
  'Nikhil Singh', 'Meera Krishnan', 'Rahul Chopra', 'Anika Desai',
];

const titles = [
  'Excellent quality!', 'Love this product', 'Great fit and feel',
  'Worth every rupee', 'Premium look', 'Exactly as described',
  'Highly recommend', 'Fantastic purchase', 'Will buy again',
  'Stylish and comfortable', 'Perfect for the occasion', 'Impressed!',
];

const comments = [
  'The material quality is outstanding. Feels premium and the fit is perfect. Delivery was quick too.',
  'Bought this for a wedding and got so many compliments. The fabric is luxurious and the stitching is impeccable.',
  'Absolutely love this! The color is exactly as shown in the pictures. Very comfortable to wear all day.',
  'Great value for money. The packaging was elegant and the product exceeded my expectations.',
  'Been using this for a month now and it still looks brand new. Excellent craftsmanship.',
  'The fit is true to size. I was initially skeptical but this has become my favorite piece.',
  'Premium feel at an affordable price point. VELORA never disappoints with their quality.',
  'Perfect for daily wear as well as special occasions. Versatile and stylish.',
  'The detailing on this piece is remarkable. You can tell it\'s made with care.',
  'Fast delivery, great packaging, and an amazing product. Will definitely shop again from VELORA.',
  'Bought as a gift and the recipient loved it. The presentation was beautiful.',
  'Comfortable, stylish, and well-made. What more could you ask for?',
];

const sizes = ['S', 'M', 'L', 'XL', '38', '40', '42', 'One Size'];

function generateReviews(): Review[] {
  const reviews: Review[] = [];
  let reviewId = 1;

  for (let productId = 1; productId <= 100; productId++) {
    const count = 3 + Math.floor(Math.random() * 3);
    for (let i = 0; i < count; i++) {
      const nameIdx = (productId * 3 + i * 5) % names.length;
      const titleIdx = (productId * 2 + i * 3) % titles.length;
      const commentIdx = (productId + i * 7) % comments.length;
      const sizeIdx = (productId + i) % sizes.length;
      const dayOffset = (productId * 4 + i * 9) % 60 + 1;
      const rating = 4 + ((productId + i) % 2 === 0 ? 1 : 0);

      reviews.push({
        id: reviewId++,
        productId,
        author: names[nameIdx],
        rating,
        date: new Date(Date.now() - dayOffset * 86400000).toLocaleDateString('en-IN', {
          day: 'numeric',
          month: 'short',
          year: 'numeric',
        }),
        title: titles[titleIdx],
        comment: comments[commentIdx],
        verified: true,
        size: sizes[sizeIdx],
      });
    }
  }

  return reviews;
}

export const reviews: Review[] = generateReviews();

export function getReviewsByProductId(productId: number): Review[] {
  return reviews.filter(r => r.productId === productId);
}

export function getRatingBreakdown(productId: number): { stars: number; count: number; percent: number }[] {
  const productReviews = getReviewsByProductId(productId);
  const total = productReviews.length || 1;
  return [5, 4, 3, 2, 1].map(stars => {
    const count = productReviews.filter(r => Math.round(r.rating) === stars).length;
    return { stars, count, percent: Math.round((count / total) * 100) };
  });
}

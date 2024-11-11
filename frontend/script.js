// Fetch professionals from the backend
function fetchProfessionals() {
    fetch('/api/professionals')
      .then(response => response.json())
      .then(professionals => {
        const professionalsList = document.getElementById('professionals-list');
        professionalsList.innerHTML = '';
        professionals.forEach(professional => {
          const card = document.createElement('div');
          card.classList.add('professional-card');
          card.innerHTML = `
            <h3>${professional.name}</h3>
            <p>Experience: ${professional.experience} years</p>
            <p>Certification: ${professional.certification}</p>
            <p>Location: ${professional.location}</p>
            <button onclick="bookAppointment('${professional._id}')">Book Appointment</button>
          `;
          professionalsList.appendChild(card);
        });
      });
  }
  
  // Fetch user profile data
  function fetchUserProfile() {
    fetch('/api/user-profile')
      .then(response => response.json())
      .then(profile => {
        const userProfileSection = document.getElementById('user-profile');
        userProfileSection.innerHTML = `
          <p>Name: ${profile.name}</p>
          <p>Email: ${profile.email}</p>
          <p>Experience: ${profile.experience} years</p>
          <p>Certifications: ${profile.certifications.join(', ')}</p>
          <p>Location: ${profile.location}</p>
        `;
      });
  }
  
  // Edit profile (open a modal or navigate to an edit page)
  document.getElementById('edit-profile-btn').addEventListener('click', () => {
    window.location.href = '/edit-profile';
  });
  
  // Fetch reviews for professionals
  function fetchReviews() {
    fetch('/api/reviews')
      .then(response => response.json())
      .then(reviews => {
        const reviewsList = document.getElementById('reviews-list');
        reviewsList.innerHTML = '';
        reviews.forEach(review => {
          const card = document.createElement('div');
          card.classList.add('review-card');
          card.innerHTML = `
            <h4>${review.userName}</h4>
            <p>Rating: ${review.rating} stars</p>
            <p>${review.comment}</p>
          `;
          reviewsList.appendChild(card);
        });
      });
  }
  
  // Book appointment with a professional
  function bookAppointment(professionalId) {
    fetch(`/api/book-appointment/${professionalId}`, { method: 'POST' })
      .then(response => response.json())
      .then(data => {
        alert('Appointment booked successfully!');
      });
  }
  
  // Initialize page content
  document.addEventListener('DOMContentLoaded', () => {
    fetchProfessionals();
    fetchUserProfile();
    fetchReviews();
  });
  
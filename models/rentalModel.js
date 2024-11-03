
const Rental = {
    rental_id: null,
    item_id: null,
    renter_id: null,
    owner_id: null,
    start_date: null,
    end_date: null,
    total_price: null,
    late_fee: null,
    status: null,
    created_at: new Date()
};

// Export the Rental model
module.exports = Rental;

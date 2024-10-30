// cart_item.dart
class CartItem {
  final int id;
  final int userId;
  final int itemId;
  final int quantity;
  final DateTime startDate;
  final DateTime endDate;

  CartItem({
    required this.id,
    required this.userId,
    required this.itemId,
    required this.quantity,
    required this.startDate,
    required this.endDate,
  });

  factory CartItem.fromJson(Map<String, dynamic> json) {
    return CartItem(
      id: json['id'],
      userId: json['user_id'],
      itemId: json['item_id'],
      quantity: json['quantity'],
      startDate: DateTime.parse(json['start_date']),
      endDate: DateTime.parse(json['end_date']),
    );
  }
}

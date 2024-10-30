// category_items_screen.dart
import 'package:flutter/material.dart';
import 'package:flutter_application_1/data/ItemService.dart';
import 'package:flutter_application_1/data/item.dart';

class CategoryItemsScreen extends StatefulWidget {
  final String categoryName;
  final int cateid;

  const CategoryItemsScreen(
      {Key? key,
      required categoryId,
      required this.categoryName,
      required this.cateid})
      : super(key: key);

  @override
  _CategoryItemsScreenState createState() => _CategoryItemsScreenState();
}

class _CategoryItemsScreenState extends State<CategoryItemsScreen> {
  final ItemService _itemService = ItemService();
  List<Item> _categoryItems = [];
  bool _isLoading = true;

  @override
  void initState() {
    super.initState();
    _fetchCategoryItems();
  }

  Future<void> _fetchCategoryItems() async {
    try {
      final items = await _itemService.fetchItemsByCategory(
          widget.cateid, widget.categoryName);
      setState(() {
        _categoryItems = items;
        _isLoading = false;
      });
    } catch (error) {
      print("Error fetching category items: $error");
      setState(() {
        _isLoading = false;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text(widget.categoryName),
        backgroundColor: const Color.fromARGB(255, 3, 138, 124),
      ),
      body: _isLoading
          ? const Center(child: CircularProgressIndicator())
          : _categoryItems.isEmpty
              ? const Center(child: Text('No items found in this category'))
              : GridView.builder(
                  padding: const EdgeInsets.all(10),
                  gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                    crossAxisCount: 2,
                    childAspectRatio: 0.75,
                    crossAxisSpacing: 10,
                    mainAxisSpacing: 10,
                  ),
                  itemCount: _categoryItems.length,
                  itemBuilder: (context, index) {
                    final item = _categoryItems[index];
                    return _buildItemCard(item);
                  },
                ),
    );
  }

  Widget _buildItemCard(Item item) {
    return Card(
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(15),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Expanded(
            child: Container(
              decoration: BoxDecoration(
                borderRadius:
                    const BorderRadius.vertical(top: Radius.circular(15)),
                image: DecorationImage(
                  image: AssetImage('assetsassets/drill.png'),
                  fit: BoxFit.cover,
                ),
              ),
            ),
          ),
          Padding(
            padding: const EdgeInsets.all(8.0),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  item.name,
                  style: const TextStyle(fontWeight: FontWeight.bold),
                  maxLines: 1,
                  overflow: TextOverflow.ellipsis,
                ),
                Text("\$${item.pricePerDay}/day"),
              ],
            ),
          ),
        ],
      ),
    );
  }
}

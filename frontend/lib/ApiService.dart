import 'dart:convert';
import 'package:http/http.dart' as http;

class ApiService {
  final String baseUrl = 'http://localhost:8087/message/';

  Future<http.Response> sendMessage(Map<String, dynamic> messageData) async {
    final url = Uri.parse('$baseUrl/newMessage');
    final response = await http.post(
      url,
      body: jsonEncode(messageData),
      headers: {"Content-Type": "application/json"},
    );
    return response;
  }

  Future<http.Response> fetchMessages(String senderId, String recepientId) async {
    final url = Uri.parse('$baseUrl/messages/$senderId/$recepientId');
    final response = await http.get(url);
    return response;
  }

  Future<http.Response> fetchAllUsers() async {
    final url = Uri.parse('$baseUrl/AllUser');
    final response = await http.get(url);
    return response;
  }

 
 Future<Map<String, dynamic>> fetchUserDetails(int userId) async {
    final response = await http.get(Uri.parse('$baseUrl/userDetailsChat/$userId'));

    if (response.statusCode == 200) {
      // Decode the JSON response and return as Map<String, dynamic>
      return jsonDecode(response.body) as Map<String, dynamic>;
    } else {
      throw Exception('Failed to load user details');
    }
  }

  Future<http.Response> deleteMessage(int messageId) async {
    final url = Uri.parse('$baseUrl/Messages');
     Map<String, int> body = {
    'message_id': messageId,
  };
   final response = await http.delete(
    url,
    headers: {'Content-Type': 'application/json'}, // Specify content type if needed
    body: json.encode(body), // Encode the body to JSON
  );

  return response;
  }


}

// import 'package:flutter/material.dart';
// import 'package:http/http.dart' as http;
// import 'dart:convert';
// // import 'userchat.dart'; // Ensure this is the correct path to your UserChat widget
// // import 'usercontext.dart'; // Your UserContext equivalent for state management
// // import 'package:provider/provider.dart';

// class ChatsScreen extends StatefulWidget {
//   @override
//   _ChatsScreenState createState() => _ChatsScreenState();
// }

// class _ChatsScreenState extends State<ChatsScreen> {
//   List<dynamic> chatPartners = [];
//   late String userId;
//   late String role;


//   @override
//   void initState() {
//     super.initState();
//     // final userContext = Provider.of<UserContext>(context, listen: false);
//     // userId = userContext.userId;
//     // role = userContext.role;

//     fetchChatPartners();
//   }

//   Future<void> fetchChatPartners() async {
//     final endpoint = (role == 'user') ? 'admin' : 'viewUser';
//     final url = Uri.parse('http://localhost:8087/message/$endpoint');

//     try {
//       final response = await http.get(url);
//       if (response.statusCode == 200) {
//         final data = json.decode(response.body);
//         setState(() {
//           chatPartners = role == 'user' ? [data['recepientId']] : data['user'];
//         });
//       } else {
//         print("Error fetching chat partners: ${response.statusCode}");
//       }
//     } catch (e) {
//       print("Error fetching chat partners: $e");
//     }
//   }

//   @override
//   Widget build(BuildContext context) {
//     return Scaffold(
//       appBar: AppBar(
//         title: Text('Chats'),
//         centerTitle: true,
//       ),
//       body: SafeArea(
//         child: Column(
//           children: [
//             Padding(
//               padding: const EdgeInsets.all(10.0),
//               child: Row(
//                 children: [
//                   Image.asset('assets/chat.png', width: 100, height: 100),
//                   SizedBox(width: 10),
//                   Text(
//                     'Chatting with ${role == 'user' ? 'admins' : 'users'}',
//                     style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold),
//                   ),
//                 ],
//               ),
//             ),
//             Expanded(
//               child: ListView.builder(
//                 itemCount: chatPartners.length,
//                 itemBuilder: (context, index) {
//                   return GestureDetector(
//                     onTap: () {
//                       Navigator.push(
//                         context,
//                         MaterialPageRoute(
//                           builder: (context) => ChatScreen(
//                             senderId: userId,
//                             recipientId: chatPartners[index]['id'], // Update this to the correct ID for navigation
//                           ),
//                         ),
//                       );
//                     },
                    
//                   );
//                 },
//               ),
//             ),
//           ],
//         ),
//       ),
//     );
//   }
// }

// // Chat Screen for individual chat interactions
// class ChatScreen extends StatefulWidget {
//   final String senderId;
//   final String recipientId;

//   const ChatScreen({Key? key, required this.senderId, required this.recipientId}) : super(key: key);

//   @override
//   _ChatScreenState createState() => _ChatScreenState();
// }

// class _ChatScreenState extends State<ChatScreen> {
//   final TextEditingController _controller = TextEditingController();
//   List<Map<String, dynamic>> messages = [];

//   @override
//   void initState() {
//     super.initState();
//     loadMessages();
//   }

//   void loadMessages() async {
//     final response = await http.get(Uri.parse('http://localhost:8087/message/messages/${widget.senderId}/${widget.recipientId}'));
//     if (response.statusCode == 200) {
//       setState(() {
//         messages = List<Map<String, dynamic>>.from(jsonDecode(response.body));
//       });
//     } else {
//       print('Failed to load messages: ${response.statusCode}');
//     }
//   }

//   void sendMessage(String content) async {
//     if (content.isEmpty) return;

//     Map<String, dynamic> messageData = {
//       'sender_id': widget.senderId,
//       'receiver_id': widget.recipientId,
//       'messageType': "text",
//       'content': content,
//     };

//     final response = await http.post(
//       Uri.parse('http://localhost:8087/message/newMessage'),
//       headers: {'Content-Type': 'application/json'},
//       body: json.encode(messageData),
//     );

//     if (response.statusCode == 200) {
//       _controller.clear();
//       loadMessages();
//     } else {
//       print('Failed to send message: ${response.statusCode}');
//     }
//   }

//   @override
//   Widget build(BuildContext context) {
//     return Scaffold(
//       appBar: AppBar(title: const Text("Chat")),
//       body: Column(
//         children: [
//           Expanded(
//             child: ListView.builder(
//               itemCount: messages.length,
//               itemBuilder: (context, index) {
//                 final message = messages[index];
//                 bool isMe = message['sender_id'] == widget.senderId;

//                 return Padding(
//                   padding: const EdgeInsets.symmetric(vertical: 5.0, horizontal: 10.0),
//                   child: Align(
//                     alignment: isMe ? Alignment.centerRight : Alignment.centerLeft,
//                     child: Container(
//                       decoration: BoxDecoration(
//                         color: isMe ? Colors.blue[300] : Colors.grey[300],
//                         borderRadius: BorderRadius.circular(10),
//                       ),
//                       padding: const EdgeInsets.all(10),
//                       child: Column(
//                         crossAxisAlignment: isMe ? CrossAxisAlignment.end : CrossAxisAlignment.start,
//                         children: [
//                           Text(message['content'] ?? "No content", style: const TextStyle(color: Colors.black)),
//                           const SizedBox(height: 5),
//                           Text(message['created_at'] ?? "Unknown time", style: const TextStyle(color: Colors.black45, fontSize: 10)),
//                          const SizedBox(height: 5),
//                           Text(message['first_name'] ?? "Unknown", style: const TextStyle(color: Colors.black45, fontSize: 10)),
                      
//                         ],
//                       ),
//                     ),
//                   ),
//                 );
//               },
//             ),
//           ),
//           Padding(
//             padding: const EdgeInsets.all(8.0),
//             child: Row(
//               children: [
//                 Expanded(
//                   child: TextField(
//                     controller: _controller,
//                     decoration: const InputDecoration(labelText: "Type a message..."),
//                   ),
//                 ),
//                 IconButton(
//                   icon: const Icon(Icons.send),
//                   onPressed: () => sendMessage(_controller.text),
//                 ),
//               ],
//             ),
//           ),
//         ],
//       ),
//     );
//   }
// }





import 'package:flutter/material.dart';
import '../../ApiService.dart'; // Ensure this path is correct
import 'dart:convert';

class ChatScreen extends StatefulWidget {
  final int senderId;
  final int recipientId;

  const ChatScreen({Key? key, required this.senderId, required this.recipientId}) : super(key: key);

  @override
  _ChatScreenState createState() => _ChatScreenState();
}

class _ChatScreenState extends State<ChatScreen> {
  final ApiService apiService = ApiService();
  final TextEditingController _controller = TextEditingController();
  List<Map<String, dynamic>> messages = [];
  int? selectedMessageIndex; // Track the selected message index for editing/deleting

  @override
  void initState() {
    super.initState();
    loadMessages();
  }

  void loadMessages() async {
    final response = await apiService.fetchMessages(widget.senderId.toString(), widget.recipientId.toString());
    if (response.statusCode == 200) {
      setState(() {
        messages = List<Map<String, dynamic>>.from(jsonDecode(response.body));
      });
    } else {
      print('Failed to load messages: ${response.statusCode}');
    }
  }

  void sendMessage(String content) async {
    if (content.isEmpty) return;

    Map<String, dynamic> messageData = {
      'sender_id': widget.senderId,
      'receiver_id': widget.recipientId,
      'content': content,
      'messageType': 'text'
    };

    final response = await apiService.sendMessage(messageData);
    if (response.statusCode == 200) {
      _controller.clear();
      loadMessages();
    } else {
      print('Failed to send message: ${response.statusCode}');
    }
  }

  void deleteMessage(int index) async {
    // Ensure you pass the correct ID for the message to be deleted
    final messageId = messages[index]['message_id'];
    
    final response = await apiService.deleteMessage(messageId);
    if (response.statusCode == 200) {
      loadMessages(); // Reload messages after deletion
      ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text('Message deleted successfully')));
    } else {
      print('Failed to delete message: ${response.statusCode}');
      ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text('Failed to delete message')));
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text("Chat"),
        centerTitle: true,
        backgroundColor: Colors.blue[200],
        actions: [
          IconButton(
            onPressed: () {
              if (selectedMessageIndex != null) {
                deleteMessage(selectedMessageIndex!);
                setState(() {
                  selectedMessageIndex = null; // Reset selection after deletion
                });
              }
            },
            icon: Icon(Icons.delete, color: Colors.pink, size: 24.0),
          ),
        ],
      ),
      body: Column(
        children: [
          Expanded(
            child: ListView.builder(
              itemCount: messages.length,
              itemBuilder: (context, index) {
                final message = messages[index];
                bool isMe = message['sender_id'] == widget.senderId;

                return GestureDetector(
                  onTap: () {
                    setState(() {
                      selectedMessageIndex = selectedMessageIndex == index ? null : index; // Toggle selection
                    });
                  },
                  child: Padding(
                    padding: const EdgeInsets.symmetric(vertical: 5.0, horizontal: 10.0),
                    child: Align(
                      alignment: isMe ? Alignment.centerRight : Alignment.centerLeft,
                      child: Container(
                        decoration: BoxDecoration(
                          color: isMe ? Colors.blue[300] : Colors.grey[300],
                          borderRadius: BorderRadius.circular(10),
                          boxShadow: selectedMessageIndex == index
                              ? [BoxShadow(color: Colors.black26, blurRadius: 30, offset: Offset(2, 2))]
                              : [],
                        ),
                        padding: const EdgeInsets.all(10),
                        child: Column(
                          crossAxisAlignment: isMe ? CrossAxisAlignment.end : CrossAxisAlignment.start,
                          children: [
                            Text(
                              message['content'] ?? "No content",
                              style: const TextStyle(color: Colors.black),
                            ),
                            const SizedBox(height: 5),
                            Text(
                              message['created_at'] ?? "Unknown time",
                              style: const TextStyle(color: Colors.black45, fontSize: 10),
                            ),
                            const SizedBox(height: 5),
                            Text(
                              message['sender_name'] ?? "Unknown",
                              style: const TextStyle(color: Colors.black45, fontSize: 10),
                            ),
                          ],
                        ),
                      ),
                    ),
                  ),
                );
              },
            ),
          ),
          Padding(
            padding: const EdgeInsets.all(8.0),
            child: Row(
              children: [
                Expanded(
                  child: TextField(
                    controller: _controller,
                    decoration: const InputDecoration(labelText: "Type a message..."),
                  ),
                ),
                IconButton(
                  icon: const Icon(Icons.send),
                  onPressed: () {
                    sendMessage(_controller.text);
                    _controller.clear(); // Clear input after sending
                  },
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}



















// import 'package:flutter/material.dart';
// import '../../ApiService.dart'; // Ensure this path is correct
// import 'dart:convert';

// class ChatScreen extends StatefulWidget {
//   final int senderId;
//   final int recipientId;

//   const ChatScreen({Key? key, required this.senderId, required this.recipientId}) : super(key: key);

//   @override
//   _ChatScreenState createState() => _ChatScreenState();
// }

// class _ChatScreenState extends State<ChatScreen> {
//   final ApiService apiService = ApiService();
//   final TextEditingController _controller = TextEditingController();
//   List<Map<String, dynamic>> messages = []; // Specify the type for better safety

//   @override
//   void initState() {
//     super.initState();
//     loadMessages();
//   }

//   void loadMessages() async {
//     final response = await apiService.fetchMessages(widget.senderId.toString(), widget.recipientId.toString());
//     if (response.statusCode == 200) {
//       print(response.body); // Log the response body to check its structure
//       setState(() {
//         messages = List<Map<String, dynamic>>.from(jsonDecode(response.body)); // Ensure correct type
//       });
//     } else {
//       // Handle errors or empty responses
//       print('Failed to load messages: ${response.statusCode}');
//     }
//   }

//   void sendMessage(String content) async {
//     if (content.isEmpty) return; // Prevent sending empty messages

//     Map<String, dynamic> messageData = {
//       'sender_id': widget.senderId,
//       'receiver_id': widget.recipientId,
//       'content': content,
//       'messageType': 'text'
//     };

//     final response = await apiService.sendMessage(messageData);
//     if (response.statusCode == 200) {
//       _controller.clear();
//       loadMessages();
//     } else {
//       print('Failed to send message: ${response.statusCode}');
//     }
//   }

//   @override
//   Widget build(BuildContext context) {
//     return Scaffold(
//       appBar: AppBar(
//         title: const Text("Chat"),
//         centerTitle: true,
//           backgroundColor: Colors.blue[200],
//         actions: [
//           IconButton(onPressed: () => {}, icon: Icon(Icons.delete, color: Colors.pink,size: 24.0)),
//           IconButton(onPressed: () => {}, icon: Icon(Icons.edit,   color: Colors.green[800],
//           size: 24.0)),
//         ],
//         ),

//       body: Column(
//         children: [
    
//           Expanded(
//             child: ListView.builder(
//               itemCount: messages.length,
//               itemBuilder: (context, index) {
//                 final message = messages[index];
//                 bool isMe = message['sender_id'] == widget.senderId;

//                 // Use null-aware operators to prevent null errors
//                 String messageContent = message['content'] ?? "No content"; // Provide a default if null
//                 String senderName = message['sender_name'] ?? "Unknown"; // Provide a default if null
//                 String timestamp = message['created_at'] ?? "Unknown time"; // Provide a default if null

//                 return Padding(
//                   padding: const EdgeInsets.symmetric(vertical: 5.0, horizontal: 10.0),
//                   child: Align(
//                     alignment: isMe ? Alignment.centerRight : Alignment.centerLeft,
//                     child: Container(
//                       decoration: BoxDecoration(
//                         color: isMe ? Colors.blue[300] : Colors.grey[300],
//                         borderRadius: BorderRadius.circular(10),
//                       ),
//                       padding: const EdgeInsets.all(10),
//                       child: Column(
//                         crossAxisAlignment: isMe ? CrossAxisAlignment.end : CrossAxisAlignment.start,
//                         children: [
//                           Text(
//                             messageContent,
//                             style: const TextStyle(color: Colors.black),
//                           ),
//                           const SizedBox(height: 5),
//                           Text(
//                             timestamp,
//                             style: const TextStyle(color: Colors.black45, fontSize: 10), // Smaller font for timestamp
//                           ),
//                            const SizedBox(height: 5),
//                           Text(
//                             senderName,
//                             style: const TextStyle(color: Colors.black45, fontSize: 10), // Smaller font for timestamp
//                           ),
                          
//                         ],
//                       ),
//                     ),
//                   ),
//                 );
//               },
//             ),
//           ),
//           Padding(
//             padding: const EdgeInsets.all(8.0),
//             child: Row(
//               children: [
//                 Expanded(
//                   child: TextField(
//                     controller: _controller,
//                     decoration: const InputDecoration(labelText: "Type a message..."),
//                   ),
//                 ),
//                 IconButton(
//                   icon: const Icon(Icons.send),
//                   onPressed: () => sendMessage(_controller.text),
//                 ),
//               ],
//             ),
//           ),
//         ],
//       ),
//     );
//   }
// }





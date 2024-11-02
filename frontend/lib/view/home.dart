import 'package:flutter/material.dart';
import 'package:frontend/controller/controller.dart';
import 'chatscreen.dart';
import '../../ApiService.dart'; // Ensure this path is correct

class Home extends StatefulWidget {
  const Home({Key? key}) : super(key: key);

  @override
  State<Home> createState() => _HomeState();
}

class _HomeState extends State<Home> {
  GetUsersController getdata = GetUsersController();
  final int senderId = 2; // Sender ID

  @override
  void initState() {
    super.initState();
  }

void _showUserInfo() {
  showDialog(
    context: context,
    builder: (BuildContext context) {
      return FutureBuilder<Map<String, dynamic>>(
        future: ApiService().fetchUserDetails(senderId), // Fetch user details using senderId
        builder: (context, snapshot) {
          if (snapshot.connectionState == ConnectionState.waiting) {
            return AlertDialog(
              title: Text("User Information"),
              content: CircularProgressIndicator(), // Show loading indicator while fetching data
            );
          } else if (snapshot.hasError) {
            return AlertDialog(
              title: Text("Error"),
              content: Text("Failed to fetch user details."),
              actions: [
                TextButton(
                  child: Text("Close"),
                  onPressed: () {
                    Navigator.of(context).pop();
                  },
                ),
              ],
            );
          } else if (!snapshot.hasData || snapshot.data == null) {
            return AlertDialog(
              title: Text("No Data"),
              content: Text("User details not found."),
              actions: [
                TextButton(
                  child: Text("Close"),
                  onPressed: () {
                    Navigator.of(context).pop();
                  },
                ),
              ],
            );
          } else {
            // Now userDetails is a Map<String, dynamic>
            final userDetails = snapshot.data!;
            return AlertDialog(
              title: Text("User Information"),
              content: Text(
                "First Name: ${userDetails['first_name'] ?? 'N/A'}\n"
                "Last Name: ${userDetails['last_name'] ?? 'N/A'}\n"
                "Email: ${userDetails['email'] ?? 'N/A'}\n"
                "Phone: ${userDetails['phone'] ?? 'N/A'}",
              ),
              actions: [
                TextButton(
                  child: Text("Close"),
                  onPressed: () {
                    Navigator.of(context).pop();
                  },
                ),
              ],
            );
          }
        },
      );
    },
  );
}

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Center(
          child: Text('User List'),
        ),
        backgroundColor: Colors.blue[200],
        actions: [
          IconButton(
            icon: Icon(Icons.account_box_rounded,size: 35,color: Colors.black,),
            onPressed: _showUserInfo,
          ),
        ],
      ),
      body: FutureBuilder(
          future: getdata.getData(),
          builder: (stx, snp) {
            if (!snp.hasData) {
              return Center(
                child: Text("No data !"),
              );
            } else if (snp.hasError) {
              return Center(
                child: CircularProgressIndicator(),
              );
            } else {
              // Filter the users to exclude the sender
              final users = snp.data.where((user) => user['user_id'] != senderId).toList();
              
              return ListView.builder(
                  itemCount: users.length,
                  itemBuilder: (ctx, index) {
                    return Padding(
                      padding: const EdgeInsets.all(7),
                      child: InkWell(
                        onTap: () {
                          final receiverId = users[index]['user_id'];
                          if (receiverId != null) {
                            Navigator.push(
                              context,
                              MaterialPageRoute(
                                builder: (context) => ChatScreen(
                                    senderId: senderId,
                                    recipientId: receiverId),
                              ),
                            );
                          } else {
                            print('Error: sender_id or receiver_id is null');
                          }
                        },
                        child: Container(
                          color: Colors.grey[200],
                          child: ListTile(
                            leading: Icon(
                              Icons.account_circle,
                              color: Colors.blue[400],
                              size: 35,
                            ),
                            title: Text(
                              "${users[index]['first_name']}",
                              style: TextStyle(fontWeight: FontWeight.bold),
                            ),
                            subtitle: Text(
                              "${users[index]['email']}",
                            ),
                          ),
                        ),
                      ),
                    );
                  });
            }
          }),
    );
  }
}

import 'package:flutter/material.dart';
import 'package:frontend/view/home.dart';
// import 'ChatScreen.dart'; // Adjust the import based on your project structure
// import 'UserChat.dart';
// import 'view/home.dart';

void main() {
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Flutter Chat App',
      theme: ThemeData(
        colorScheme: ColorScheme.fromSeed(seedColor: Colors.deepPurple),
        useMaterial3: true,
      ),
      debugShowCheckedModeBanner: false,
      home:const Home(), // Call the MyHomePage widget
    );
  }
}

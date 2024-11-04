import 'dart:math';

import 'package:flutter/material.dart';
import 'package:flutter_dotenv/flutter_dotenv.dart';
import 'package:zego_uikit_prebuilt_video_conference/zego_uikit_prebuilt_video_conference.dart';

Future main() async {
  await dotenv.load(fileName: '.env');
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      debugShowCheckedModeBanner: false,
      title: 'zego',
      home: HomePage(),
    );
  }
}

final String userId = Random().nextInt(900000 + 100000).toString();
final String randomconferecedId =
    (Random().nextInt(1000000000) * 10 + Random().nextInt(10))
        .toString()
        .padLeft(10, '0');

class HomePage extends StatelessWidget {
  HomePage({super.key});
  final confrencidController = TextEditingController();

  @override
  Widget build(BuildContext context) {
    var buttonStyle = ElevatedButton.styleFrom(
        backgroundColor: Color.fromARGB(255, 84, 25, 95),
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)));
    return Scaffold(
      body: Padding(
        padding: EdgeInsets.symmetric(horizontal: 24),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Text('User Id: $userId'),
            Text('test'),
            SizedBox(
              height: 20,
            ),
            TextFormField(
              maxLength: 10,
              keyboardType: TextInputType.number,
              controller: confrencidController,
              decoration: const InputDecoration(
                labelText: 'join a meeting',
                labelStyle: TextStyle(color: Colors.white),
                border: OutlineInputBorder(
                  borderRadius: BorderRadius.all(
                    Radius.circular(10),
                  ),
                ),
              ),
            ),
            ElevatedButton(
              style: buttonStyle,
              child: Text(
                'join',
                style: TextStyle(color: Colors.white),
              ),
              onPressed: () => jumpToMeetingPage(
                context,
                confrenceId: confrencidController.text,
              ),
            ),
            SizedBox(
              height: 16,
            ),
            ElevatedButton(
              style: buttonStyle,
              child: Text(
                'start a meeting',
                style: TextStyle(color: Colors.white),
              ),
              onPressed: () => jumpToMeetingPage(
                context,
                confrenceId: randomconferecedId,
              ),
            )
          ],
        ),
      ),
    );
  }

  jumpToMeetingPage(BuildContext context, {required String confrenceId}) {
    Navigator.push(
      context,
      MaterialPageRoute(
        builder: (context) => VideoConferencePage(
          confrenceID: confrenceId,
        ),
      ),
    );
  }
}

class VideoConferencePage extends StatelessWidget {
  final String confrenceID;
  VideoConferencePage({super.key, required this.confrenceID});
  final int appID = int.parse(dotenv.get('ZEGO_APP_ID'));
  final String appSign = dotenv.get('ZEGO_APP_ID_SIGN');

  @override
  Widget build(BuildContext context) {
    return SafeArea(
      child: ZegoUIKitPrebuiltVideoConference(
        appID:
            appID, // Fill in the appID that you get from ZEGOCLOUD Admin Console.
        appSign:
            appSign, // Fill in the appSign that you get from ZEGOCLOUD Admin Console.
        userID: userId,
        userName: 'user_$userId',
        conferenceID: confrenceID,
        config: ZegoUIKitPrebuiltVideoConferenceConfig(),
      ),
    );
  }
}

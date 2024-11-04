import 'dart:convert';

import 'package:http/http.dart' as http;

class GetUsersController {
  Future getData() async {
    var url = 'http://localhost:8087/message/AllUser';
    var res = await http.get(Uri.parse(url));
    if (res.statusCode == 200) {
      var data = jsonDecode(res.body);

      print(data);
      return data;
    }
  }
    Future delete () async {
    var url = 'http://localhost:8087/message/AllUser';
    var res = await http.get(Uri.parse(url));
    if (res.statusCode == 200) {
      var data = jsonDecode(res.body);

      print(data);
      return data;
    }
  }
}

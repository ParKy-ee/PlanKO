import 'package:flutter/material.dart';
import 'package:flutter_planko/database/db_helper.dart';

class WelcomePage extends StatefulWidget {
  const WelcomePage({super.key});

  @override
  State<WelcomePage> createState() => _WelcomePageState();
}

class _WelcomePageState extends State<WelcomePage> {
  var weight = TextEditingController();
  var height = TextEditingController();
  var age = TextEditingController();
  var gender = TextEditingController();

  Future<int> insertUser() async {
    final db = await DatabaseHelper.instance.database;
    return await db.insert('user_model', {
      'weight': int.parse(weight.text),
      'height': int.parse(height.text),
      'age': int.parse(age.text),
      'gender': int.parse(gender.text),
      'createdAt': DateTime.now().toIso8601String(),
      'updatedAt': DateTime.now().toIso8601String(),
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text('PlanKO')),
      body: SingleChildScrollView(
        child: Column(
          children: [
            Text('Welcome to PlanKO'),
            Padding(
              padding: const EdgeInsets.all(8.0),
              child: TextField(
                controller: weight,
                decoration: InputDecoration(hintText: 'Weight'),
                keyboardType: TextInputType.number,
                style: TextStyle(color: Colors.black),
                onSubmitted: null,
              ),
            ),
            Padding(
              padding: const EdgeInsets.all(8.0),
              child: TextField(
                controller: height,
                decoration: InputDecoration(hintText: 'Height'),
                keyboardType: TextInputType.number,
                style: TextStyle(color: Colors.black),
                onSubmitted: null,
              ),
            ),
            Padding(
              padding: const EdgeInsets.all(8.0),
              child: TextField(
                controller: age,
                decoration: InputDecoration(hintText: 'Age'),
                keyboardType: TextInputType.number,
                style: TextStyle(color: Colors.black),
                onSubmitted: null,
              ),
            ),
            Padding(
              padding: const EdgeInsets.all(8.0),
              child: TextField(
                controller: gender,
                decoration: InputDecoration(hintText: 'Gender'),
                keyboardType: TextInputType.number,
                style: TextStyle(color: Colors.black),
                onSubmitted: null,
              ),
            ),
            ElevatedButton(
              onPressed: () async {
                await insertUser();
                Navigator.pushNamed(context, '/mission');
              },
              child: Text('sent'),
            ),
          ],
        ),
      ),
    );
  }
}

import 'package:flutter/material.dart';
import 'package:flutter_planko/services/api/client.dart';

class PosturePlankPage extends StatefulWidget {
  const PosturePlankPage({super.key, required this.id});
  final String id;

  @override
  State<PosturePlankPage> createState() => _PosturePlankPageState();
}

class _PosturePlankPageState extends State<PosturePlankPage> {
  final Client client = Client();
  Map<String, dynamic>? posture;

  Future<void> getPostureById(int id) async {
    final response = await client.getPostureById(id);
    setState(() {
      posture = response['data'][0];
    });
  }

  @override
  void initState() {
    super.initState();
    getPostureById(int.parse(widget.id));
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text(
          'Posture Plank',
          style: TextStyle(color: Colors.white),
        ),
        backgroundColor: Colors.blue,
        iconTheme: const IconThemeData(color: Colors.white),
      ),
      body: Center(
        child: posture == null
            ? const CircularProgressIndicator()
            : Column(
                children: [
                  const SizedBox(height: 16),
                  Text(posture!['postureName']?.toString() ?? 'Unknown'),
                  const SizedBox(height: 16),
                  Container(
                    width: 150,
                    height: 150,
                    color: const Color.fromARGB(255, 193, 198, 202),
                    child: Align(
                      alignment: Alignment.center,
                      child: Text('Image'),
                    ),
                  ),
                  const SizedBox(height: 30),
                  if (posture!.containsKey('postureType') &&
                      posture!['postureType'] != null)
                    Text('Type: ' + posture!['postureType']!.toString()),
                  const SizedBox(height: 30),
                  Text(
                    'Description: ' +
                        (posture!['postureDescription']?.toString() ??
                            'No description'),
                  ),
                  const SizedBox(height: 30),
                ],
              ),
      ),
    );
  }
}

import 'package:flutter/material.dart';
import 'package:flutter_planko/data/models/posture.dart';

class PostureDetailPage extends StatelessWidget {
  final PostureModel posture;

  const PostureDetailPage({super.key, required this.posture});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.white,
      appBar: AppBar(
        backgroundColor: Colors.white,
        elevation: 0,
        leading: IconButton(
          icon: const Icon(Icons.arrow_back, color: Colors.black),
          onPressed: () => Navigator.pop(context),
        ),
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.symmetric(horizontal: 24.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text(
              'รายละเอียด',
              style: TextStyle(
                fontSize: 32,
                fontWeight: FontWeight.bold,
                color: Colors.black,
              ),
            ),
            const SizedBox(height: 16),
            Center(
              child: Text(
                posture.name,
                style: const TextStyle(
                  fontSize: 24,
                  fontWeight: FontWeight.normal,
                  color: Colors.black87,
                ),
              ),
            ),
            const SizedBox(height: 32),
            
            // Image Placeholder (Like the illustration in the image)
            Center(
              child: Container(
                width: double.infinity,
                height: 200,
                decoration: BoxDecoration(
                  color: Colors.grey.shade50,
                  borderRadius: BorderRadius.circular(20),
                ),
                child: Hero(
                  tag: 'posture-${posture.id}',
                  child: const Icon(
                    Icons.accessibility_new_rounded, // Placeholder icon
                    size: 120,
                    color: Colors.blueGrey,
                  ),
                ),
              ),
            ),
            
            const SizedBox(height: 48),
            
            _buildDetailRow('ประเภท :', posture.postureCategory?.name ?? 'ทั่วไป'),
            const SizedBox(height: 32),
            _buildDetailRow('คำอธิบาย :', posture.description),
            const SizedBox(height: 32),
            _buildDetailRow('ช่วยด้าน :', posture.benefit),
            
            const SizedBox(height: 40),
          ],
        ),
      ),
    );
  }

  Widget _buildDetailRow(String label, String value) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          label,
          style: const TextStyle(
            fontSize: 22,
            fontWeight: FontWeight.bold,
            color: Colors.black,
          ),
        ),
        const SizedBox(height: 12),
        Padding(
          padding: const EdgeInsets.only(left: 4.0),
          child: Text(
            value.isEmpty ? '-' : value,
            style: TextStyle(
              fontSize: 16,
              height: 1.6,
              color: Colors.grey.shade800,
            ),
          ),
        ),
      ],
    );
  }
}

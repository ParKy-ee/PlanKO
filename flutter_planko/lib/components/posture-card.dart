import 'dart:convert';

import 'package:flutter/material.dart';
import 'package:flutter_planko/pages/user/posture-plank.dart';

class PostureCard extends StatelessWidget {
  const PostureCard({super.key, required this.posture});

  final List<Map<String, dynamic>> posture;

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        for (var item in posture)
          Container(
            margin: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
            padding: const EdgeInsets.only(
              left: 16,
              top: 16,
              bottom: 12,
              right: 12,
            ),
            decoration: BoxDecoration(
              color: const Color(0xFFDDF3FE),
              borderRadius: BorderRadius.circular(16),
            ),
            child: Row(
              crossAxisAlignment: CrossAxisAlignment.center,
              children: [
                Container(
                  width: 80,
                  height: 60,
                  margin: const EdgeInsets.only(right: 16),
                  child: item['postureImage'] != null
                      ? Image.network(
                          item['postureImage'],
                          fit: BoxFit.contain,
                          errorBuilder: (context, error, stackTrace) =>
                              const Icon(
                                Icons.image_not_supported,
                                color: Colors.grey,
                              ),
                        )
                      : Image.asset(
                          'assets/images/placeholder.png', // Fallback, could be removed if you don't use assets
                          fit: BoxFit.contain,
                          errorBuilder: (context, error, stackTrace) =>
                              const Icon(
                                Icons.fitness_center,
                                size: 40,
                                color: Colors.grey,
                              ),
                        ),
                ),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        item['postureName'] ?? '',
                        style: const TextStyle(
                          fontSize: 20,
                          fontWeight: FontWeight.w500,
                          color: Color(0xFF333333),
                        ),
                      ),
                      const SizedBox(height: 4),
                      Text(
                        item['postureDescription'] ?? '',
                        style: const TextStyle(
                          fontSize: 14,
                          color: Color(0xFF555555),
                        ),
                        maxLines: 2,
                        overflow: TextOverflow.ellipsis,
                      ),
                      const SizedBox(height: 8),
                      Align(
                        alignment: Alignment.bottomRight,
                        child: ElevatedButton(
                          onPressed: () {
                            Navigator.push(
                              context,
                              MaterialPageRoute(
                                builder: (context) =>
                                    PosturePlankPage(id: item['id'].toString()),
                              ),
                            );
                          },
                          style: ElevatedButton.styleFrom(
                            backgroundColor: const Color(
                              0xFF007BFF,
                            ), // Blue color
                            foregroundColor: Colors.white,
                            elevation: 0,
                            padding: const EdgeInsets.symmetric(
                              horizontal: 16,
                              vertical: 6,
                            ),
                            minimumSize: const Size(0, 32),
                            shape: RoundedRectangleBorder(
                              borderRadius: BorderRadius.circular(8),
                            ),
                          ),
                          child: const Text(
                            'ดูรายละเอียด',
                            style: TextStyle(
                              fontSize: 13,
                              fontWeight: FontWeight.normal,
                            ),
                          ),
                        ),
                      ),
                    ],
                  ),
                ),
              ],
            ),
          ),
      ],
    );
  }
}

import 'dart:io';

import 'package:sqflite/sqflite.dart';
import 'package:path/path.dart';

class DatabaseHelper {
  static final DatabaseHelper instance = DatabaseHelper._initialize();
  static Database? _database;

  DatabaseHelper._initialize();

  Future<Database> get database async {
    if (_database != null) {
      return _database!;
    }
    _database = await _initDatabase();
    return _database!;
  }

  Future<List<Map<String, Object?>>> readUser() async {
    final db = await database;
    return await db.query('user_model');
  }

  Future<Database> _initDatabase() async {
    final dbPath = await getDatabasesPath();
    final path = join(dbPath, 'planko.db');
    await Directory(dbPath).create(recursive: true);
    return await openDatabase(path, version: 1, onCreate: _onCreate);
  }

  Future<void> _onCreate(Database db, int version) async {
    await db.execute('''
      CREATE TABLE user_model (
        weight INTEGER NOT NULL,
        height INTEGER NOT NULL,
        age INTEGER NOT NULL,
        gender TEXT NOT NULL,
        createdAt TEXT NOT NULL,
        updatedAt TEXT NOT NULL
      )
    ''');
  }
}

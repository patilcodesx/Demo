// MongoDB Initialization
db = db.getSiblingDB('talkfiy');

db.createCollection('messages');
db.createCollection('code_executions');

db.messages.createIndex({ chatId: 1, timestamp: -1 });
db.messages.createIndex({ senderId: 1 });
db.messages.createIndex({ type: 1 });
db.messages.createIndex({ content: "text" });

print('✅ MongoDB initialized');

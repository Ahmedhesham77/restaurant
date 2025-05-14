import mongoose from 'mongoose';

// الاتصال بقاعدة البيانات
const uri = 'mongodb://ahmadhesham797979:froGGUJtfK0DhpH6@ac-qfqlwrn-shard-00-00.flrmboq.mongodb.net:27017,ac-qfqlwrn-shard-00-01.flrmboq.mongodb.net:27017,ac-qfqlwrn-shard-00-02.flrmboq.mongodb.net:27017/?ssl=true&replicaSet=atlas-cxz9l8-shard-0&authSource=admin&retryWrites=true&w=majority&appName=Cluster7';
mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });

const db = mongoose.connection;

db.once('open', async () => {
    console.log('Connected to the database.');

    try {
        // عرض الفهارس
        const indexes = await db.collection('promocodes').indexes();
        console.log('Current Indexes:', indexes);

        // حذف الفهرس القديم
        await db.collection('promocodes').dropIndex('code_1');
        console.log('Dropped index "code_1".');

        // إعادة تسمية الحقل
        await db.collection('promocodes').updateMany({}, { $rename: { "code": "promoCode" } });
        console.log('Renamed field "code" to "promoCode".');

        // إنشاء الفهرس الجديد
        await db.collection('promocodes').createIndex({ promoCode: 1 }, { unique: true });
        console.log('Created unique index on "promoCode".');
    } catch (error) {
        console.error('Error:', error);
    } finally {
        mongoose.disconnect();
    }
});

db.on('error', console.error.bind(console, 'MongoDB connection error:'));

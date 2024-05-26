import { MongoMemoryServer } from 'mongodb-memory-server';

export const startAsMemMongo = async () => {
  const mongod = await MongoMemoryServer.create();
  const uri = mongod.getUri();
  console.log('mongo mem created');
  return { uri };
};
export const startAsLocalMongo = () => {
  return { uri: 'mongodb://localhost:27017/tst' };
};

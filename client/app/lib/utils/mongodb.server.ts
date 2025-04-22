import {
  MongoClient,
  type Filter,
  type Document,
  type FindOptions,
} from "mongodb";

const url = process.env.DB_URl || "mongodb://localhost:27017";
const client = new MongoClient(url, {
  maxPoolSize: 10,
  minPoolSize: 4, // 最小连接数
});
const dbName = process.env.DB_DB_NAME;

const getCollection = async (collectionName: string) => {
  const connection = await client.connect();
  const db = connection.db(dbName);
  return db.collection(collectionName);
};

export const find = async (
  collectionName: string,
  {
    filter = {},
    sort = {},
    project = {},
  }: {
    filter?: Filter<Document>;
    sort?: {
      [key in string]: 1 | -1;
    };
    project?: { [key in string]: number };
  }
): Promise<any[]> => {
  try {
    const collection = await getCollection(collectionName);
    return await collection.find(filter).project(project).sort(sort).toArray();
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const findWithPagination = async (
  collectionName: string,
  {
    filter = {},
    sort = {},
    project = {},
    page = 1,
    pageSize = 10,
  }: {
    filter: Filter<Document>;
    sort: {
      [key in string]: 1 | -1;
    };
    project: FindOptions<Document>;
    page: number;
    pageSize: number;
  }
) => {
  try {
    const collection = await getCollection(collectionName);

    const totalDocuments = await getCount(collectionName);
    const totalPages = Math.ceil(totalDocuments / pageSize);
    const result = await collection
      .find(filter)
      .project(project)
      .sort(sort)
      .skip((page - 1) * pageSize)
      .limit(pageSize ?? totalDocuments)
      .toArray();

    return {
      data: result,
      totalDocuments,
      totalPages,
      currentPage: page,
      pageSize,
    };
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const insert = async (collectName: string, newData: any & any[]) => {
  try {
    const collection = await getCollection(collectName);
    if (Array.isArray(newData)) {
      return await collection.insertMany(newData);
    }

    return await collection.insertOne(newData);
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const update = async (
  collectionName: string,
  filter: Filter<Document>,
  update: Document
) => {
  try {
    const collection = await getCollection(collectionName);
    return await collection.updateMany(filter, update);
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const deleteData = async (
  collectionName: string,
  filter: Filter<Document> = {}
) => {
  try {
    const collection = await getCollection(collectionName);
    return await collection.deleteMany(filter);
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const getCount = async (
  collectionName: string,
  filter: Filter<Document> = {}
) => {
  try {
    const collection = await getCollection(collectionName);
    if (Object.keys(filter).length === 0) {
      return await collection.countDocuments(filter, { hint: "_id_" });
    }

    return await collection.countDocuments(filter);
  } catch (error) {
    console.log(error);
    throw error;
  }
};

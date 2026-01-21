import {
  MongoClient,
  type Filter,
  type Document,
  type UpdateOptions,
} from "mongodb";

const client = new MongoClient(process.env.MONGODB_URI!, {
  maxPoolSize: 10,
  minPoolSize: 4, // 最小连接数
});
const getCollection = async (collectionName: string) => {
  const connection = await client.connect();
  const db = connection.db(process.env.MONGODB_NAME);
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
): Promise<Document[]> => {
  const collection = await getCollection(collectionName);
  return await collection.find(filter).project(project).sort(sort).toArray();
};

export const findOne = async (
  collectionName: string,
  filter: Filter<Document>,
  project?: Document
) => {
  const collection = await getCollection(collectionName);
  return await collection.findOne(filter, {
    projection: project,
  });
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
    filter?: Filter<Document>;
    sort?: {
      [key in string]: 1 | -1;
    };
    project?: Document;
    page: number;
    pageSize: number;
  }
) => {
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
};

export const insert = async (
  collectName: string,
  newData: Document | Document[]
) => {
  const collection = await getCollection(collectName);
  if (Array.isArray(newData)) {
    return await collection.insertMany(newData);
  }

  return await collection.insertOne(newData);
};

export const update = async (
  collectionName: string,
  filter: Filter<Document>,
  update: Document
) => {
  const collection = await getCollection(collectionName);
  return await collection.updateMany(filter, update);
};

export const updateOne = async (
  collectionName: string,
  filter: Filter<Document>,
  update: Document,
  options?: UpdateOptions
) => {
  const collection = await getCollection(collectionName);
  return await collection.updateOne(filter, update, options);
};

export const updateOrInsertBaseOnConditions = async <T>(
  collectionName: string,
  filter: Filter<Document>,
  {
    notFindHandle,
    conditionsHandle,
  }: {
    notFindHandle: () => false | Document;
    conditionsHandle: (doc: T) => false | Document;
  }
) => {
  const findResult = await findOne(collectionName, filter);

  if (findResult) {
    const conditionsResult = conditionsHandle(findResult as T);
    if (conditionsResult) {
      return await updateOne(collectionName, filter, conditionsResult);
    }
    return;
  }

  const notFindResult = notFindHandle();

  if (notFindResult) {
    return await insert(collectionName, notFindResult);
  }
};

export const deleteMany = async (
  collectionName: string,
  filter: Filter<Document> = {}
) => {
  const collection = await getCollection(collectionName);
  return await collection.deleteMany(filter);
};

export const deleteOne = async (
  collectionName: string,
  filter: Filter<Document> = {}
) => {
  const collection = await getCollection(collectionName);
  return await collection.deleteOne(filter);
};

export const getCount = async (
  collectionName: string,
  filter: Filter<Document> = {}
) => {
  const collection = await getCollection(collectionName);
  if (Object.keys(filter).length === 0) {
    return await collection.countDocuments(filter, { hint: "_id_" });
  }

  return await collection.countDocuments(filter);
};

export const getAggregate = async (
  collectionName: string,
  pipeline: Document[]
) => {
  const collection = await getCollection(collectionName);
  return await collection.aggregate(pipeline).toArray();
};

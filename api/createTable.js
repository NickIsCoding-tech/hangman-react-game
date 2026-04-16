import { DynamoDBClient, CreateTableCommand } from "@aws-sdk/client-dynamodb";

console.log("Starting table creation inside api container...");

const client = new DynamoDBClient({
  region: "us-east-1",
  endpoint: "http://dynamodb-local:8000",
  credentials: {
    accessKeyId: "fakeAccessKey",
    secretAccessKey: "fakeSecretKey",
  },
});

const command = new CreateTableCommand({
  TableName: "players",
  AttributeDefinitions: [
    { AttributeName: "playerName", AttributeType: "S" }
  ],
  KeySchema: [
    { AttributeName: "playerName", KeyType: "HASH" }
  ],
  BillingMode: "PAY_PER_REQUEST"
});

try {
  const result = await client.send(command);
  console.log("Table created successfully");
  console.log(JSON.stringify(result, null, 2));
} catch (err) {
  console.log("Table creation result:");
  console.log(err.name);
  console.log(err.message);
}
process.exit(0);

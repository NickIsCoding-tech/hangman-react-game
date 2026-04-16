import express from "express";
import cors from "cors";
import { DynamoDBClient, CreateTableCommand } from "@aws-sdk/client-dynamodb";
import {
  DynamoDBDocumentClient,
  PutCommand,
  GetCommand,
  UpdateCommand,
} from "@aws-sdk/lib-dynamodb";

const app = express();
const PORT = 3001;
const TABLE_NAME = "players";

// middleware setup
app.use(cors({ origin: "http://localhost:5173" }));
app.use(express.json());

// connect to local DynamoDB
const dynamoEndpoint = process.env.DYNAMO_ENDPOINT || "http://localhost:8000";

const client = new DynamoDBClient({
  region: "us-east-1",
  endpoint: dynamoEndpoint,
  credentials: {
    accessKeyId: "fakeKey",
    secretAccessKey: "fakeSecret",
  },
});

const docClient = DynamoDBDocumentClient.from(client);

async function createPlayersTableIfNeeded() {
  const command = new CreateTableCommand({
    TableName: TABLE_NAME,
    AttributeDefinitions: [
      { AttributeName: "playerName", AttributeType: "S" },
    ],
    KeySchema: [
      { AttributeName: "playerName", KeyType: "HASH" },
    ],
    BillingMode: "PAY_PER_REQUEST",
  });

  const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  for (let attempt = 1; attempt <= 10; attempt++) {
    try {
      await client.send(command);
      console.log("players table created");
      return;
    } catch (error) {
      if (error.name === "ResourceInUseException") {
        console.log("players table already exists");
        return;
      }

      console.log(`table creation attempt ${attempt} failed: ${error.message}`);
      await wait(3000);
    }
  }

  console.log("could not create players table after multiple attempts");
}

// helper: calculate win percentage
function getWinRate(wins, losses) {
  const total = wins + losses;
  if (total === 0) return 0;
  return Number(((wins / total) * 100).toFixed(1));
}

// CREATE PLAYER
app.post("/api/players", async (req, res) => {
  const { playerName } = req.body;
  console.log("POST /api/players hit");

  if (!playerName) {
    return res.status(400).send({
      message: "playerName is required",
    });
  }

  const newPlayer = {
    playerName: playerName,
    wins: 0,
    losses: 0,
    winPercentage: 0,
  };

  const command = new PutCommand({
    TableName: TABLE_NAME,
    Item: newPlayer,
  });

  try {
    await docClient.send(command);

    res.status(201).send({
      message: "Player created",
      item: newPlayer,
    });
  } catch (err) {
    console.error("Error creating player:", err);

    res.status(500).send({
      message: "Could not create player",
      error: err.message,
    });
  }
});

// GET PLAYER
app.get("/api/player", async (req, res) => {
  const name = req.query.playerName;
  console.log("GET /api/player hit");

  if (!name) {
    return res.status(400).send({
      message: "playerName query is required",
    });
  }

  const command = new GetCommand({
    TableName: TABLE_NAME,
    Key: { playerName: name },
  });

  try {
    const result = await docClient.send(command);

    if (!result.Item) {
      return res.status(404).send({
        message: "Player not found",
      });
    }

    res.status(200).send({
      message: "Player found",
      item: result.Item,
    });
  } catch (err) {
    console.error("Error fetching player:", err);

    res.status(500).send({
      message: "Error getting player",
      error: err.message,
    });
  }
});

// UPDATE PLAYER STATS
app.put("/api/player", async (req, res) => {
  const { playerName, wins, losses } = req.body;
  console.log("PUT /api/player hit");

  if (!playerName || wins == null || losses == null) {
    return res.status(400).send({
      message: "playerName, wins, and losses are required",
    });
  }

  const winRate = getWinRate(wins, losses);

  const command = new UpdateCommand({
    TableName: TABLE_NAME,
    Key: { playerName: playerName },
    UpdateExpression:
      "set wins = :w, losses = :l, winPercentage = :p",
    ExpressionAttributeValues: {
      ":w": wins,
      ":l": losses,
      ":p": winRate,
    },
    ReturnValues: "ALL_NEW",
  });

  try {
    const updated = await docClient.send(command);

    res.status(200).send({
      message: "Stats updated",
      item: updated.Attributes,
    });
  } catch (err) {
    console.error("Update error:", err);

    res.status(500).send({
      message: "Failed to update stats",
      error: err.message,
    });
  }
});

export { app };

async function startServer() {
  await createPlayersTableIfNeeded();

  app.listen(PORT, () => {
    console.log(`API running on http://localhost:${PORT}`);
  });
}

if (process.env.NODE_ENV !== "test") {
  startServer();
}
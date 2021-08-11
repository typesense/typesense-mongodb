# Typesense MongoDB Integration
![CircleCI](https://img.shields.io/circleci/build/github/typesense/typesense-mongodb/master)

A CLI to sync documents from a MongoDB collection to Typesense. 

## Installation

```bash
npm install -g typesense-mongodb
```
## Usage

### Prerequisites

- Make sure you are running MongoDB instance in a replica set. Or convert your [standalone MongoDB instance to MongoDB replica set](https://docs.mongodb.com/manual/tutorial/convert-standalone-to-replica-set/).
- We highly recommend that you stop writes to your MongoDB collection until you get a message from the process.
- If you are familiar with Typesense, it has an option to mark certain fields as **facets**. If you would like to use this feature, create your own Typesense collection and pass the collection name as an argument.

### Example

```bash
typesense-mongodb \
    --mongo-collection=collection \
    --mongo-database=database \
    --typesense-collection=collection \
    --mongo-url=mongodb://localhost:27017 \
    --typesense-url=http://localhost:8108 \
    --typesense-api-key=xyz
```

### Arguments

| Parameter | Default | Description |
| :--- | :--- |:--- |
| `--mongo-database` | database | MongoDB database name |
| `--mongo-collection` | collection | MongoDB collection name |
| `--mongo-url` | mongodb://localhost:27017 | MongoDB instance URI along with username and passsword |
| `--typesense-collection` | collection | Typesense collection name |
| `--typesense-url` | http://localhost:8108 | Typesense endpoint URL |
| `--typesense-api-key` | xyz | Typesense API key |


## Support

Please open a Github issue or join our [Slack Community](https://join.slack.com/t/typesense-community/shared_invite/zt-mx4nbsbn-AuOL89O7iBtvkz136egSJg)

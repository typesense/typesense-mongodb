# Typesense MongoDB Intergration

A CLI to sync documents from a MongoDB collection to Typesense. 

## Installation

Clone this repository and run,

```bash
npm install && npm link
```

This will globally creates a symlink so you can use `typesense-mongodb` to access the CLI.

## Usage

### Prerequisites

- Make sure you are running MongoDB instance in a replica set. Or convert your [standalone MongoDB instance to MongoDB replica set](https://docs.mongodb.com/manual/tutorial/convert-standalone-to-replica-set/).
- We highly recommend that you stop writes to your MongoDB collection until you get a message from the process.
- If you are familiar with Typesense, it has an option to mark certain fields as **facets**. If you would like to use this feature, create your own Typesense collection and pass the collection name as an argument.

### Example

```bash
typesense-mongodb \
    --mcol=collection \
    --mdb=database \
    --tcol=collection \
    --murl=mongodb://localhost:27017 \
    --turl=http://localhost:8108 \
    --tkey=xyz
```

### Arguments

| Parameter | Default | Description |
| :--- | :--- |:--- |
| `--mdb` | database | MongoDB database name |
| `--mcol` | collection | MongoDB collection name |
| `--murl` | mongodb://localhost:27017 | MongoDB instance URI along with username and passsword |
| `--tcol` | collection | Typesense collection name |
| `--turl` | http://localhost:8108 | Typesense endpoint URL |
| `--tkey` | xyz | Typesense API key |


## Support

Please open a Github issue or join our [Slack Community](https://join.slack.com/t/typesense-community/shared_invite/zt-mx4nbsbn-AuOL89O7iBtvkz136egSJg)

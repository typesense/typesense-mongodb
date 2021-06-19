# Documentation

A CLI to to sync documents from MongoDB collection to Typesense. 

## Installation

Clone this repository and run,

```bash
npm install && npm link
```

This will globally creates a symlink so you can use `typesense-mongodb` access the CLI.

## Usage

### Prerequisites

- Make sure your running MongoDB instance is a replica set. Or convert your [standalone MongoDB instance to MongoDB replica set](https://docs.mongodb.com/manual/tutorial/convert-standalone-to-replica-set/).
- We highly recommend you to stop writes to your MongoDB collection until you get *DONE* message from CLI.
- If you are familiar with Typesense, it has an option mark certain fields as **facets**. If you would like to use this feature make sure to create your own Typesense collection and pass the collection name as an argument.
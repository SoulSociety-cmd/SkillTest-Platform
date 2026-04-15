rsconf = {
  _id: "rs0",
  members: [
    { _id: 0, host: "mongodb1:27017" },
    { _id: 1, host: "mongodb2:27017" },
    { _id: 2, host: "mongodb3:27017" }
  ]
};

if (rs.status().codeName === 'NotYetInitialized') {
  var status = rs.initiate(rsconf);
  printjson(status);
  sleep(3000); // Wait for replication
  rs.status();
} else {
  print("Replica set already initialized");
}


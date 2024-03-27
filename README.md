# Process CSV and Get Some Metrics with Nest.js

## Stack
- Node.js;  
- Typescript;  
- Nest.js;  
- Multer.


## Config and Installation

- You need to be installed Node.js v20;  
- Install dependencies: `npm install`;  
- To run: `npm run start:dev`.


## Test upload CSV in Postman
- Just following this cURL:
```
curl --location 'http://localhost:4000/csv' \
--form 'file=@"/modelo-teste-full-stack.xlsx"'
```

## Main Metrics

- MRR: Monthly Recurring Revenue;  
- ARR: Annual Recurring Revenue;  
- Churn Rate;  
- Active Clients in 2022 and 2023;  
- Canceled Clients in 2022 and 2023.

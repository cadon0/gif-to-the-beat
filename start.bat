IF EXIST node_modules (
  npm start
) ELSE (
  npm ci & npm start
)

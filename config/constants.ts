export default () => ({
  core: {
    node_env: process.env.NODE_ENV || 'development',
    timezone: process.env.TIMEZONE,
    app_name: process.env.APP_NAME,
    app_port: parseInt(process.env.APP_PORT) || 4000,
  },
});

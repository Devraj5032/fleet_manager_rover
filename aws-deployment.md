# AWS Deployment Guide for Rover Management System

This guide provides step-by-step instructions for deploying the Rover Management System to AWS infrastructure. The system consists of a Node.js server application and a React frontend, which will be deployed as a single service using AWS Elastic Beanstalk.

## Prerequisites

1. **AWS Account**: You need an active AWS account with sufficient permissions to create resources.
2. **AWS CLI**: Install and configure the AWS CLI on your local machine.
3. **Elastic Beanstalk CLI**: Install the EB CLI for easier deployment.
4. **PostgreSQL Database**: A running PostgreSQL database instance (AWS RDS recommended).

## Setting Up AWS Resources

### 1. Create an RDS PostgreSQL Instance

```bash
# Create a PostgreSQL database in AWS RDS
aws rds create-db-instance \
    --db-instance-identifier rover-management-db \
    --db-instance-class db.t3.micro \
    --engine postgres \
    --allocated-storage 20 \
    --master-username adminuser \
    --master-user-password SecurePassword123! \
    --vpc-security-group-ids sg-xxxxxxxx \
    --db-name rovermanagement
```

**Important**: Replace the example values with your actual preferred values, especially the security group ID and password.

### 2. Create an Elastic Beanstalk Application

```bash
# Create a new Elastic Beanstalk application
eb init rover-management-system --platform "Node.js" --region us-east-1
```

**Note**: Replace `us-east-1` with your preferred AWS region.

### 3. Create an Environment

```bash
# Create a new environment using the application
eb create rover-management-production --elb-type application
```

## Preparing Your Project for Deployment

### 1. Create an Elastic Beanstalk Configuration File

Create a `.ebextensions` directory at the root of your project and add the following configuration files:

**`.ebextensions/nodecommand.config`**:
```yaml
option_settings:
  aws:elasticbeanstalk:container:nodejs:
    NodeCommand: "npm start"
```

**`.ebextensions/env.config`**:
```yaml
option_settings:
  aws:elasticbeanstalk:application:environment:
    NODE_ENV: production
    PORT: 8080
    # You'll need to set the DATABASE_URL in the Elastic Beanstalk console for security
```

### 2. Create a Procfile

Create a `Procfile` at the root of your project:

```
web: npm start
```

### 3. Update Package.json Start Script

Make sure your `package.json` file has the correct start script:

```json
{
  "scripts": {
    "start": "node server/index.js",
    ...
  }
}
```

### 4. Generate Production Build

Before deploying, build your frontend:

```bash
npm run build
```

## Deployment Process

### 1. Configure Environment Variables

Set up the following environment variables in the Elastic Beanstalk environment through the AWS Console:

- `DATABASE_URL`: Connection string for your PostgreSQL database
- `SESSION_SECRET`: A secure random string for session management
- Any other environment-specific variables your application needs

### 2. Deploy Your Application

```bash
# Deploy to your Elastic Beanstalk environment
eb deploy rover-management-production
```

### 3. Verify Deployment

```bash
# Open the deployed application in a browser
eb open
```

## Setting Up the ROS Client

The ROS client should be installed on each rover device and configured to connect to your deployed server:

1. Clone the repository on the rover device
2. Navigate to the `ros-client` directory
3. Install dependencies with `npm install`
4. Create a `.env` file based on `.env.example`:
   ```
   SERVER_URL=wss://your-elastic-beanstalk-url.elasticbeanstalk.com
   ROVER_IDENTIFIER=R-001
   ```
5. Start the client with `node index.js`

## Monitoring and Maintenance

### 1. View Application Logs

```bash
# View logs from the Elastic Beanstalk environment
eb logs
```

### 2. SSH into the EC2 Instance

```bash
# Connect to the EC2 instance for troubleshooting
eb ssh
```

### 3. Monitor RDS Performance

Use AWS CloudWatch to monitor the performance of your RDS database instance.

## Security Considerations

1. **Network Security**: Configure your security groups to allow only necessary inbound traffic
2. **Database Security**: Use strong passwords and consider enabling SSL for database connections
3. **Application Security**: Ensure your WebSocket connections use secure protocols and validate all rover clients

## Scaling Considerations

1. **Elastic Beanstalk Auto Scaling**: Configure auto-scaling groups to handle increased load
2. **WebSocket Connections**: Set up sticky sessions to maintain WebSocket connections during scaling events
3. **RDS Scaling**: Monitor database performance and scale up as needed

## Backup and Recovery

1. **RDS Automated Backups**: Enable automated backups for your RDS instance
2. **Application State**: Ensure critical application state is stored in the database to facilitate recovery

## Cost Optimization

1. **Right-Sizing**: Choose appropriate instance sizes for your workload
2. **Reserved Instances**: Consider purchasing reserved instances for long-term use
3. **Monitoring**: Use CloudWatch to monitor resource utilization and identify optimization opportunities
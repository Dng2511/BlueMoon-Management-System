USE [master];
IF NOT EXISTS (SELECT * FROM sys.databases WHERE name = 'BlueMoon')
BEGIN
    CREATE DATABASE BlueMoon;
END
GO

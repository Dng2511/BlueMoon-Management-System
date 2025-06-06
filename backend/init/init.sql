USE master;
GO

IF EXISTS (SELECT * FROM sys.databases WHERE name = 'BlueMoon')
BEGIN
    ALTER DATABASE BlueMoon SET SINGLE_USER WITH ROLLBACK IMMEDIATE;
    DROP DATABASE BlueMoon;
END
GO

RESTORE DATABASE BlueMoon
FROM DISK = '/init/BlueMoon.bak'
WITH
    MOVE 'BlueMoon' TO '/var/opt/mssql/data/BlueMoon.mdf',
    MOVE 'BlueMoon_log' TO '/var/opt/mssql/data/BlueMoon_log.ldf',
    REPLACE;
GO

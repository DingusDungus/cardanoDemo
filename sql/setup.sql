DROP DATABASE IF EXISTS cardanoDemo;
DROP USER IF EXISTS 'cardanoDemo'@'localhost';
CREATE DATABASE cardanoDemo;

CREATE USER IF NOT EXISTS 'cardanoDemo'@'localhost'
	IDENTIFIED BY 'idontknowthepass'
;

GRANT ALL PRIVILEGES
    ON cardanoDemo.*
    TO 'cardanoDemo'@'localhost'
    WITH GRANT OPTION
;
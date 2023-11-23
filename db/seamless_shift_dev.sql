-- MySQL Script generated by MySQL Workbench
-- Mon Sep 18 20:41:35 2023
-- Model: New Model    Version: 1.0
-- MySQL Workbench Forward Engineering
SET 
  @OLD_UNIQUE_CHECKS = @@UNIQUE_CHECKS, 
  UNIQUE_CHECKS = 0;
SET 
  @OLD_FOREIGN_KEY_CHECKS = @@FOREIGN_KEY_CHECKS, 
  FOREIGN_KEY_CHECKS = 0;
SET 
  @OLD_SQL_MODE = @@SQL_MODE, 
  SQL_MODE = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';
-- -----------------------------------------------------
-- Schema shift_db
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `shift_db` DEFAULT CHARACTER SET utf8;
USE `shift_db`;
-- -----------------------------------------------------
-- Table `shift_db`.`facility`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `shift_db`.`facility` (
  `id` INT NOT NULL AUTO_INCREMENT, 
  `name` VARCHAR(60) NOT NULL, 
  PRIMARY KEY (`id`), 
  UNIQUE INDEX `name_UNIQUE` (`name` ASC) VISIBLE
) ENGINE = InnoDB;
-- -----------------------------------------------------
-- Table `shift_db`.`role`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `shift_db`.`role` (
  `id` INT NOT NULL AUTO_INCREMENT, 
  `name` VARCHAR(45) NOT NULL, 
  PRIMARY KEY (`id`), 
  UNIQUE INDEX `name_UNIQUE` (`name` ASC) VISIBLE
) ENGINE = InnoDB;
-- -----------------------------------------------------
-- Table `shift_db`.`user`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `shift_db`.`user` (
  `id` INT NOT NULL AUTO_INCREMENT, 
  `password` VARCHAR(128) NOT NULL, 
  `name` VARCHAR(45) NOT NULL, 
  `surname` VARCHAR(45) NOT NULL, 
  `email` VARCHAR(90) NOT NULL, 
  `phone` VARCHAR(15) NOT NULL, 
  `facility_id` INT NOT NULL, 
  `role_id` INT NOT NULL, 
  `deleted` TINYINT(1) NOT NULL, 
  `password_change_required` TINYINT(1) NOT NULL, 
  PRIMARY KEY (`id`), 
  UNIQUE INDEX `email_UNIQUE` (`email` ASC) VISIBLE, 
  INDEX `fk_user_facility_idx` (`facility_id` ASC) VISIBLE, 
  INDEX `fk_user_role1_idx` (`role_id` ASC) VISIBLE, 
  CONSTRAINT `fk_user_facility` FOREIGN KEY (`facility_id`) REFERENCES `shift_db`.`facility` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION, 
  CONSTRAINT `fk_user_role1` FOREIGN KEY (`role_id`) REFERENCES `shift_db`.`role` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE = InnoDB;
-- -----------------------------------------------------
-- Table `shift_db`.`subject_type`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `shift_db`.`subject_type` (
  `id` INT NOT NULL AUTO_INCREMENT, 
  `type` VARCHAR(45) NOT NULL, 
  PRIMARY KEY (`id`), 
  UNIQUE INDEX `type_UNIQUE` (`type` ASC) VISIBLE
) ENGINE = InnoDB;
-- -----------------------------------------------------
-- Table `shift_db`.`course`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `shift_db`.`course` (
  `id` INT NOT NULL AUTO_INCREMENT, 
  `name` VARCHAR(60) NOT NULL, 
  PRIMARY KEY (`id`)
) ENGINE = InnoDB;
-- -----------------------------------------------------
-- Table `shift_db`.`subject`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `shift_db`.`subject` (
  `id` INT NOT NULL AUTO_INCREMENT, 
  `description` VARCHAR(150) NULL, 
  `day` VARCHAR(10) NOT NULL, 
  `start` TIME NOT NULL, 
  `end` TIME NOT NULL, 
  `classroom` VARCHAR(8) NOT NULL, 
  `user_id` INT NOT NULL, 
  `date` DATE NOT NULL,
  `subject_type_id` INT NOT NULL, 
  `course_id` INT NOT NULL, 
  `visible` TINYINT(1) NOT NULL,
  PRIMARY KEY (`id`),
  INDEX `fk_subject_user1_idx` (`user_id` ASC) VISIBLE, 
  INDEX `fk_subject_subject_type1_idx` (`subject_type_id` ASC) VISIBLE, 
  INDEX `fk_subject_course1_idx` (`course_id` ASC) VISIBLE, 
  CONSTRAINT `fk_subject_user1` FOREIGN KEY (`user_id`) REFERENCES `shift_db`.`user` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION, 
  CONSTRAINT `fk_subject_subject_type1` FOREIGN KEY (`subject_type_id`) REFERENCES `shift_db`.`subject_type` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION, 
  CONSTRAINT `fk_subject_course1` FOREIGN KEY (`course_id`) REFERENCES `shift_db`.`course` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE = InnoDB;
-- -----------------------------------------------------
-- Table `shift_db`.`request`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `shift_db`.`request` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `issue_date` DATETIME NOT NULL,
  `comment` VARCHAR(150) NULL,
  `subject_id` INT NOT NULL,
  `user_id` INT NOT NULL,
  `date` DATE NOT NULL,
  `status` VARCHAR(45) NOT NULL,
  PRIMARY KEY (`id`),
  INDEX `fk_request_subject1_idx` (`subject_id` ASC) VISIBLE,
  INDEX `fk_request_user1_idx` (`user_id` ASC) VISIBLE,
  CONSTRAINT `fk_request_subject1`
    FOREIGN KEY (`subject_id`)
    REFERENCES `shift_db`.`subject` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_request_user1`
    FOREIGN KEY (`user_id`)
    REFERENCES `shift_db`.`user` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;
-- -----------------------------------------------------
-- Table `shift_db`.`replacement`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `shift_db`.`replacement` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `request_id` INT NOT NULL,
  `subject_id` INT NOT NULL,
  `user_id` INT NOT NULL,
  PRIMARY KEY (`id`),
  INDEX `fk_replacement_request1_idx` (`request_id` ASC) VISIBLE,
  INDEX `fk_replacement_subject1_idx` (`subject_id` ASC) VISIBLE,
  INDEX `fk_replacement_user1_idx` (`user_id` ASC) VISIBLE,
  CONSTRAINT `fk_replacement_request1`
    FOREIGN KEY (`request_id`)
    REFERENCES `shift_db`.`request` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_replacement_subject1`
    FOREIGN KEY (`subject_id`)
    REFERENCES `shift_db`.`subject` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_replacement_user1`
    FOREIGN KEY (`user_id`)
    REFERENCES `shift_db`.`user` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;
-- Inserting roles
INSERT INTO shift_db.role (id, name) 
VALUES 
  (1, 'user'), 
  (2, 'admin');
-- Inserting facilities
INSERT INTO shift_db.facility (id, name) 
VALUES 
  (1, 'Facility A'), 
  (2, 'Facility B'), 
  (3, 'Facility C');
-- Inserting users
INSERT INTO shift_db.user (
  id, password, name, surname, email, 
  phone, facility_id, role_id, deleted, 
  password_change_required
) 
VALUES 
  (
    1, '$pbkdf2-sha256$29000$uvdeC.FcSwlBaO09B8CY0w$1jWZ4nV32W9fMdu6bQT4Darq3m3DKMixb7k63xrLmUs', 
    'admin', 'admin', 'admin@pollub.pl', 
    '555-555-5551', 1, 2, 0, 1
  ), 
  -- Admin user
  (
    2, '$pbkdf2-sha256$29000$.V8LwXiPca61tvb.P0fIeQ$BtPjf.0tBC8vypK6cgrYzbQka3sLi918TtdyOHwrTVY', 
    'Jan', 'Kowalski', 'jan.kowalski@pollub.pl', 
    '555-555-5552', 2, 1, 0, 1
  ), 
  -- Regular user
  (
    3, '$pbkdf2-sha256$29000$E6JUKmWstRYCgBCCkPIeow$2rAXUlPWfOGceJb4nXqwAYiq5tOH/.Kw5vF9X0y/uLw', 
    'student', 'student', 'student@pollub.pl', 
    '555-555-5553', 3, 1, 0, 1
  );
  -- Regular user
-- Inserting subject_types
INSERT INTO `shift_db`.`subject_type` (`id`, `type`) 
VALUES 
  (1, 'wyklad');
INSERT INTO `shift_db`.`subject_type` (`id`, `type`) 
VALUES 
  (2, 'cw');
INSERT INTO `shift_db`.`subject_type` (`id`, `type`) 
VALUES 
  (3, 'lab');
-- Inserting courses
INSERT INTO `shift_db`.`course` (`id`, `name`) 
VALUES 
  (1, 'Mathematics');
INSERT INTO `shift_db`.`course` (`id`, `name`) 
VALUES 
  (2, 'Physics');
INSERT INTO `shift_db`.`course` (`id`, `name`) 
VALUES 
  (3, 'Computer Science');
-- Inserting subjects
INSERT INTO `shift_db`.`subject` (
  `description`, `day`, `start`, `end`, 
  `classroom`, `user_id`, `date`, `subject_type_id`, `course_id`, `visible`
) 
VALUES 
  (
    'Mathematics 101', 'Monday', '08:00:00', 
    '09:30:00', 'Room 101', 1, '2023-11-06', 1, 1, 1
  ), 
  (
    'Physics 202', 'Wednesday', '10:00:00', 
    '11:30:00', 'Room 202', 2, '2023-11-08', 2, 2, 1
  ), 
  (
    'Chemistry 303', 'Friday', '13:00:00', 
    '14:30:00', 'Room 303', 3, '2023-11-10', 3, 3, 1
  );
-- Inserting requests
INSERT INTO `shift_db`.`request` (`issue_date`, `comment`, `subject_id`, `user_id`, `date`, `status`) 
VALUES ('2023-11-08 08:30:00', 'Request for shift change due to appointment', 1, 1, '2023-11-15 08:00:00', 'Requested');

INSERT INTO `shift_db`.`request` (`issue_date`, `comment`, `subject_id`, `user_id`, `date`, `status`) 
VALUES ('2023-11-08 09:00:00', 'Need day off for personal reasons', 2, 2, '2023-11-20 09:00:00', 'Requested');

INSERT INTO `shift_db`.`request` (`issue_date`, `comment`, `subject_id`, `user_id`, `date`, `status`) 
VALUES ('2023-11-08 09:30:00', 'Requesting shift swap with colleague', 3, 3, '2023-11-22 16:00:00', 'Requested');
SET 
  SQL_MODE = @OLD_SQL_MODE;
SET 
  FOREIGN_KEY_CHECKS = @OLD_FOREIGN_KEY_CHECKS;
SET 
  UNIQUE_CHECKS = @OLD_UNIQUE_CHECKS;

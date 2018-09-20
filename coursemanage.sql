/*
 Navicat Premium Data Transfer

 Source Server         : 课程管理
 Source Server Type    : MySQL
 Source Server Version : 80012
 Source Host           : localhost:3306
 Source Schema         : coursemanage

 Target Server Type    : MySQL
 Target Server Version : 80012
 File Encoding         : 65001

 Date: 20/09/2018 11:38:23
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for admin
-- ----------------------------
DROP TABLE IF EXISTS `admin`;
CREATE TABLE `admin`  (
  `a_id` int(11) NOT NULL AUTO_INCREMENT COMMENT '主键',
  `a_account` char(20) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '管理员账户',
  `a_password` char(20) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '管理员密码',
  `a_times` datetime(0) NULL DEFAULT NULL COMMENT '最后登录时间',
  PRIMARY KEY (`a_id`) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of admin
-- ----------------------------
INSERT INTO `admin` VALUES (1, 'admin', 'admin', '2018-09-20 09:23:32');

-- ----------------------------
-- Table structure for answer
-- ----------------------------
DROP TABLE IF EXISTS `answer`;
CREATE TABLE `answer`  (
  `an_id` int(11) UNSIGNED ZEROFILL NOT NULL AUTO_INCREMENT COMMENT '主键',
  `an_q_id` int(11) NULL DEFAULT NULL COMMENT 'Questions表中的主键',
  `an_content` text CHARACTER SET utf8 COLLATE utf8_general_ci NULL COMMENT '答案内容',
  `an_time` datetime(0) NULL DEFAULT NULL COMMENT '回答时间',
  `an_name` char(10) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '回答者姓名',
  `an_account` char(20) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '回答者账号',
  PRIMARY KEY (`an_id`) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Table structure for class
-- ----------------------------
DROP TABLE IF EXISTS `class`;
CREATE TABLE `class`  (
  `c_id` int(11) NOT NULL AUTO_INCREMENT COMMENT '主键',
  `c_class` char(10) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '班级编号：如201801',
  `c_specialty` varchar(50) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '班级专业',
  `c_status` int(2) NULL DEFAULT 1 COMMENT '班级状态：1表示正常，2表示结业，其他表示异常',
  PRIMARY KEY (`c_id`) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of class
-- ----------------------------
INSERT INTO `class` VALUES (1, '201801', '计算机科学', 1);

-- ----------------------------
-- Table structure for curricuium
-- ----------------------------
DROP TABLE IF EXISTS `curricuium`;
CREATE TABLE `curricuium`  (
  `c_id` int(11) NOT NULL AUTO_INCREMENT COMMENT '主键',
  `c_class` char(10) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '班级编号',
  `c_name` varchar(50) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '课程名称',
  `c_account` char(20) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '任课教师账户',
  `c_time` int(5) NULL DEFAULT NULL COMMENT '上课时间:\r\n11:星期一上午第一节；\r\n21：星期二\r\n',
  `c_start` datetime(0) NULL DEFAULT NULL COMMENT '课程开始时间',
  `c_end` date NULL DEFAULT NULL COMMENT '课程结束时间',
  `c_addr` char(10) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '上课地址',
  `c_status` int(2) NULL DEFAULT NULL COMMENT '课表状态：1表示正常，其他表示异常',
  PRIMARY KEY (`c_id`) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Table structure for notice
-- ----------------------------
DROP TABLE IF EXISTS `notice`;
CREATE TABLE `notice`  (
  `n_id` int(11) NOT NULL AUTO_INCREMENT COMMENT '主键',
  `n_class` char(10) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '班级编号',
  `n_title` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '公告主题',
  `n_content` text CHARACTER SET utf8 COLLATE utf8_general_ci NULL COMMENT '公告内容',
  `n_name` char(10) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '发布人姓名',
  `n_time` datetime(0) NULL DEFAULT NULL COMMENT '发布时间',
  `n_account` char(20) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '发布人账号',
  PRIMARY KEY (`n_id`) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Table structure for questions
-- ----------------------------
DROP TABLE IF EXISTS `questions`;
CREATE TABLE `questions`  (
  `q_id` int(11) NOT NULL AUTO_INCREMENT COMMENT '主键',
  `q_class` char(10) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '班级编号',
  `q_title` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '问题题干',
  `q_content` text CHARACTER SET utf8 COLLATE utf8_general_ci NULL COMMENT '问题内容',
  `q_time` datetime(0) NULL DEFAULT NULL COMMENT '提问时间',
  `q_answer` text CHARACTER SET utf8 COLLATE utf8_general_ci NULL COMMENT '答案',
  `q_name` char(10) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '问题发布者姓名：教师姓名',
  `q_account` char(10) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '问题发布者账号',
  PRIMARY KEY (`q_id`) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Table structure for students
-- ----------------------------
DROP TABLE IF EXISTS `students`;
CREATE TABLE `students`  (
  `s_id` int(11) NOT NULL AUTO_INCREMENT COMMENT '主键',
  `s_name` char(10) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '学生姓名',
  `s_sex` char(5) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '学生性别',
  `s_account` char(20) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '学生账户',
  `s_password` char(20) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '学生密码',
  `s_class` char(10) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '所属班级',
  `s_status` int(2) NULL DEFAULT 1 COMMENT '账户状态：1表示正常，其他表示异常',
  `s_times` datetime(0) NULL DEFAULT NULL COMMENT '最后登录时间',
  PRIMARY KEY (`s_id`) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of students
-- ----------------------------
INSERT INTO `students` VALUES (1, 'student', '男', 'student', 'student', '201801', 1, '2018-09-20 09:31:28');

-- ----------------------------
-- Table structure for teacher
-- ----------------------------
DROP TABLE IF EXISTS `teacher`;
CREATE TABLE `teacher`  (
  `t_id` int(11) NOT NULL AUTO_INCREMENT COMMENT '主键',
  `t_account` char(20) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '教师账户',
  `t_name` char(10) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '教师姓名',
  `t_password` char(20) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '教师密码',
  `t_times` datetime(0) NULL DEFAULT NULL COMMENT '最后登录时间',
  `t_status` int(2) NULL DEFAULT 1 COMMENT '账户状态：1表示正常，其他表示异常',
  PRIMARY KEY (`t_id`) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of teacher
-- ----------------------------
INSERT INTO `teacher` VALUES (1, 'teacher', 'teacher', 'teacher', '2018-09-20 09:36:14', 1);

SET FOREIGN_KEY_CHECKS = 1;

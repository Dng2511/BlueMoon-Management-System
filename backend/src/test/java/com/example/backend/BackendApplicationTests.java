package com.example.backend;

import org.junit.jupiter.api.Test;
import org.junit.platform.suite.api.SelectPackages;
import org.junit.platform.suite.api.Suite;
import org.junit.platform.suite.api.SuiteDisplayName;
import org.springframework.boot.test.context.SpringBootTest;

@SpringBootTest
@Suite
@SuiteDisplayName("All Tests")
@SelectPackages("com.example.backend.controllers")
class BackendApplicationTests {

//    @Test
//    void contextLoads() {
//    }

}

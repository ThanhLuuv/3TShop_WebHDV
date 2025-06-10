package com.project._TShop.Utils;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class AppLogger {

    // volatile đảm bảo visibility giữa các thread
    private static volatile AppLogger instance;
    private final Logger logger;

    private AppLogger() {
        logger = LoggerFactory.getLogger(AppLogger.class);
    }

    /**
     * Thread-safe getInstance() sử dụng Double-Checked Locking Pattern
     * @return AppLogger instance duy nhất
     */
    public static AppLogger getInstance() {
        if (instance == null) {
            synchronized (AppLogger.class) {
                if (instance == null) {
                    instance = new AppLogger();
                }
            }
        }
        return instance;
    }

    public void info(String message) {
        logger.info(message);
    }

    public void error(String message) {
        logger.error(message);
    }

    public void debug(String message) {
        logger.debug(message);
    }
    
    public void warn(String message) {
        logger.warn(message);
    }
    
    public void trace(String message) {
        logger.trace(message);
    }
}
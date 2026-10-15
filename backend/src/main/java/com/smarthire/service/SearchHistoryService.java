package com.smarthire.service;

import com.smarthire.document.SearchHistoryDocument;
import com.smarthire.repository.SearchHistoryRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.List;
import java.util.Map;

@Service
public class SearchHistoryService {

    private static final Logger logger = LoggerFactory.getLogger(SearchHistoryService.class);

    private final SearchHistoryRepository searchHistoryRepository;

    public SearchHistoryService(SearchHistoryRepository searchHistoryRepository) {
        this.searchHistoryRepository = searchHistoryRepository;
    }

    @Async
    public void recordSearch(Long userId, String keyword, String location, Map<String, Object> filters) {
        if (userId == null || (keyword == null && location == null)) {
            return;
        }
        try {
            SearchHistoryDocument doc = new SearchHistoryDocument(userId, keyword, location, filters);
            searchHistoryRepository.save(doc);
        } catch (Exception ex) {
            logger.warn("Could not save search history to MongoDB: {}", ex.getMessage());
        }
    }

    public List<SearchHistoryDocument> getUserSearchHistory(Long userId) {
        try {
            return searchHistoryRepository.findTop20ByUserIdOrderBySearchedAtDesc(userId);
        } catch (Exception ex) {
            logger.warn("Could not load search history: {}", ex.getMessage());
            return Collections.emptyList();
        }
    }

    public List<Map> getTrendingSearches() {
        try {
            return searchHistoryRepository.findTrendingSearches();
        } catch (Exception ex) {
            logger.warn("Could not aggregate trending searches: {}", ex.getMessage());
            return Collections.emptyList();
        }
    }
}

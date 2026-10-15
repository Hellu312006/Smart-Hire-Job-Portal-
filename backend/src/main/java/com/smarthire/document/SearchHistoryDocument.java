package com.smarthire.document;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@Document(collection = "search_history")
public class SearchHistoryDocument {

    @Id
    private String id;

    @Indexed
    private Long userId;

    private String keyword;
    private String location;
    private Map<String, Object> filters = new HashMap<>();
    private LocalDateTime searchedAt;

    public SearchHistoryDocument() {
        this.searchedAt = LocalDateTime.now();
    }

    public SearchHistoryDocument(Long userId, String keyword, String location, Map<String, Object> filters) {
        this.userId = userId;
        this.keyword = keyword;
        this.location = location;
        this.filters = filters != null ? filters : new HashMap<>();
        this.searchedAt = LocalDateTime.now();
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }
    public String getKeyword() { return keyword; }
    public void setKeyword(String keyword) { this.keyword = keyword; }
    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }
    public Map<String, Object> getFilters() { return filters; }
    public void setFilters(Map<String, Object> filters) { this.filters = filters; }
    public LocalDateTime getSearchedAt() { return searchedAt; }
    public void setSearchedAt(LocalDateTime searchedAt) { this.searchedAt = searchedAt; }
}

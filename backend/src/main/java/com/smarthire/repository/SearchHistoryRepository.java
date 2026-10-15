package com.smarthire.repository;

import com.smarthire.document.SearchHistoryDocument;
import org.springframework.data.mongodb.repository.Aggregation;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Map;

@Repository
public interface SearchHistoryRepository extends MongoRepository<SearchHistoryDocument, String> {
    List<SearchHistoryDocument> findTop20ByUserIdOrderBySearchedAtDesc(Long userId);

    @Aggregation(pipeline = {
        "{ '$match': { 'keyword': { '$ne': null, '$ne': '' } } }",
        "{ '$group': { '_id': { '$toLower': '$keyword' }, 'count': { '$sum': 1 } } }",
        "{ '$sort': { 'count': -1 } }",
        "{ '$limit': 8 }"
    })
    List<Map> findTrendingSearches();
}

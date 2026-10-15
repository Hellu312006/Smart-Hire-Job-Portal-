package com.smarthire.repository;

import com.smarthire.document.CandidateProfileDocument;
import org.springframework.data.mongodb.repository.Aggregation;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@Repository
public interface CandidateProfileRepository extends MongoRepository<CandidateProfileDocument, String> {
    Optional<CandidateProfileDocument> findByUserId(Long userId);
    boolean existsByUserId(Long userId);

    @Aggregation(pipeline = {
        "{ '$unwind': '$skills' }",
        "{ '$group': { '_id': '$skills', 'count': { '$sum': 1 } } }",
        "{ '$sort': { 'count': -1 } }",
        "{ '$limit': 10 }"
    })
    List<Map> findTopSkills();
}

package com.smarthire.repository;

import com.smarthire.entity.SavedJob;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface SavedJobRepository extends JpaRepository<SavedJob, Long> {

    Page<SavedJob> findByCandidateId(Long candidateId, Pageable pageable);

    boolean existsByCandidateIdAndJobId(Long candidateId, Long jobId);

    Optional<SavedJob> findByCandidateIdAndJobId(Long candidateId, Long jobId);

    void deleteByCandidateIdAndJobId(Long candidateId, Long jobId);

    long countByCandidateId(Long candidateId);
}

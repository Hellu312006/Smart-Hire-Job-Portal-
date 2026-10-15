package com.smarthire.repository;

import com.smarthire.entity.Application;
import com.smarthire.entity.ApplicationStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ApplicationRepository extends JpaRepository<Application, Long> {

    Page<Application> findByCandidateId(Long candidateId, Pageable pageable);

    List<Application> findByCandidateId(Long candidateId);

    Page<Application> findByJobId(Long jobId, Pageable pageable);

    Page<Application> findByJobCompanyRecruiterId(Long recruiterId, Pageable pageable);

    List<Application> findByJobCompanyRecruiterId(Long recruiterId);

    boolean existsByJobIdAndCandidateId(Long jobId, Long candidateId);

    Optional<Application> findByJobIdAndCandidateId(Long jobId, Long candidateId);

    long countByCandidateId(Long candidateId);

    long countByCandidateIdAndStatus(Long candidateId, ApplicationStatus status);

    long countByJobCompanyRecruiterId(Long recruiterId);

    long countByJobCompanyRecruiterIdAndStatus(Long recruiterId, ApplicationStatus status);

    long countByStatus(ApplicationStatus status);

    @Query("SELECT a.status, COUNT(a) FROM Application a WHERE a.job.company.recruiter.id = :recruiterId GROUP BY a.status")
    List<Object[]> countApplicationsByStatusForRecruiter(@Param("recruiterId") Long recruiterId);

    @Query("SELECT a.status, COUNT(a) FROM Application a GROUP BY a.status")
    List<Object[]> countApplicationsByStatusPlatformWide();
}

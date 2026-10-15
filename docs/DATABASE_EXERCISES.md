# SmartHire Database Learning & Academic Exercises
### Comprehensive SQL & MongoDB Mastery Guide for Computer Engineering

This guide is designed for Computer Engineering students and software engineers to practice relational (MySQL) and document-oriented (MongoDB) database queries using real data from the **SmartHire** platform.

---

## Part 1: Relational Database Exercises (MySQL 8)

### Exercise 1: SELECT, WHERE, and ORDER BY
* **Concept:** Filtering records with boolean predicates and ordering result sets.
* **Problem:** Retrieve all active job openings located in California or marked as 'Remote', sorted by maximum salary in descending order.
* **Runnable Query:**
  ```sql
  SELECT id, title, location, employment_type, min_salary, max_salary
  FROM jobs
  WHERE status = 'ACTIVE' 
    AND (location LIKE '%CA%' OR location LIKE '%Remote%')
  ORDER BY max_salary DESC;
  ```
* **Expected Output:**
  ```text
  +----+--------------------------------+----------------------------+-----------------+------------+------------+
  | id | title                          | location                   | employment_type | min_salary | max_salary |
  +----+--------------------------------+----------------------------+-----------------+------------+------------+
  |  1 | Senior Full Stack Java Engineer| San Francisco, CA (Hybrid) | FULL_TIME       |  125000.00 |  165000.00 |
  |  2 | Frontend React Developer       | Remote                     | REMOTE          |   85000.00 |  115000.00 |
  +----+--------------------------------+----------------------------+-----------------+------------+------------+
  ```

---

### Exercise 2: INSERT, UPDATE, and DELETE
* **Concept:** Data Manipulation Language (DML) for CRUD operations.
* **Problem:** Insert a temporary job posting, update its salary range, and safely delete it.
* **Runnable Query:**
  ```sql
  -- Step 1: Insert record
  INSERT INTO jobs (company_id, title, description, location, min_salary, max_salary, employment_type, experience_level, status)
  VALUES (1, 'QA Automation Engineer', 'Design Playwright automation suites.', 'Remote', 70000.00, 95000.00, 'FULL_TIME', 'MID', 'ACTIVE');

  -- Step 2: Update salary range
  UPDATE jobs 
  SET min_salary = 75000.00, max_salary = 100000.00 
  WHERE title = 'QA Automation Engineer';

  -- Step 3: Delete the test record
  DELETE FROM jobs WHERE title = 'QA Automation Engineer';
  ```
* **Expected Result:** Rows affected: 1 at each operation.

---

### Exercise 3: INNER JOIN and LEFT JOIN
* **Concept:** Joining related tables to combine relational datasets.
* **Problem:** 
  1. Retrieve all jobs with their associated company name (INNER JOIN).
  2. List all registered users and any applications they submitted, including users who haven't applied to any job (LEFT JOIN).
* **Runnable Query:**
  ```sql
  -- 1. INNER JOIN: Jobs with Company details
  SELECT j.id, j.title, c.name AS company_name, c.website, j.location
  FROM jobs j
  INNER JOIN companies c ON j.company_id = c.id;

  -- 2. LEFT JOIN: Candidates and their application count
  SELECT u.id, u.full_name, u.email, COUNT(a.id) AS total_applications
  FROM users u
  LEFT JOIN applications a ON u.id = a.candidate_id
  WHERE u.role = 'CANDIDATE'
  GROUP BY u.id, u.full_name, u.email;
  ```

---

### Exercise 4: GROUP BY and HAVING
* **Concept:** Data aggregation and filtering on aggregated values.
* **Problem:** Calculate the total number of applications per recruitment status, but only show statuses that have at least 1 applicant.
* **Runnable Query:**
  ```sql
  SELECT status, COUNT(*) AS application_count
  FROM applications
  GROUP BY status
  HAVING COUNT(*) >= 1
  ORDER BY application_count DESC;
  ```
* **Expected Output:**
  ```text
  +-------------+-------------------+
  | status      | application_count |
  +-------------+-------------------+
  | SHORTLISTED |                 1 |
  | APPLIED     |                 1 |
  +-------------+-------------------+
  ```

---

### Exercise 5: Subqueries (Correlated and Scalar)
* **Concept:** Nesting queries inside SELECT, WHERE, or FROM clauses.
* **Problem:** Find all jobs whose maximum salary is higher than the average maximum salary of all active jobs on the platform.
* **Runnable Query:**
  ```sql
  SELECT id, title, max_salary
  FROM jobs
  WHERE max_salary > (
      SELECT AVG(max_salary) 
      FROM jobs 
      WHERE status = 'ACTIVE'
  );
  ```

---

### Exercise 6: Primary and Foreign Keys
* **Concept:** Relational integrity via parent-child table enforcement.
* **Problem:** Verify foreign key constraints by attempting to insert an application referencing an invalid `job_id` or `candidate_id`.
* **Runnable Query:**
  ```sql
  -- Attempt invalid insert
  INSERT INTO applications (job_id, candidate_id, status)
  VALUES (99999, 3, 'APPLIED');
  ```
* **Expected Output:**
  `ERROR 1452 (23000): Cannot add or update a child row: a foreign key constraint fails (fk_applications_job)`

---

### Exercise 7: Unique Constraints
* **Concept:** Ensuring no duplicate records exist across key pairs.
* **Problem:** Verify that a candidate can only apply once per job opening through the `uq_job_candidate` constraint.
* **Runnable Query:**
  ```sql
  -- Candidate #3 attempts duplicate application to Job #1
  INSERT INTO applications (job_id, candidate_id, status)
  VALUES (1, 3, 'APPLIED');
  ```
* **Expected Output:**
  `ERROR 1062 (23000): Duplicate entry '1-3' for key 'applications.uq_job_candidate'`

---

### Exercise 8: Indexes & Query Optimization
* **Concept:** B-Tree indexing to convert linear table scans (O(N)) into logarithmic index lookups (O(log N)).
* **Problem:** Analyze execution plans using `EXPLAIN`.
* **Runnable Query:**
  ```sql
  EXPLAIN SELECT * FROM users WHERE email = 'alex@example.com';
  ```
* **Expected Output:**
  `type: const`, `possible_keys: idx_users_email, email`, `key: email`, `rows: 1`. Single-row index lookup.

---

### Exercise 9: Transactions and ACID Properties
* **Concept:** Atomicity, Consistency, Isolation, and Durability using `START TRANSACTION`, `COMMIT`, and `ROLLBACK`.
* **Problem:** Simulate an atomic recruiter registration that creates both the user and their company profile in a single transaction.
* **Runnable Query:**
  ```sql
  START TRANSACTION;

  INSERT INTO users (full_name, email, password_hash, role, enabled)
  VALUES ('Elena Rostova', 'elena@novatech.io', '$2a$10$xyz...', 'RECRUITER', TRUE);

  SET @new_user_id = LAST_INSERT_ID();

  INSERT INTO companies (name, website, industry, location, recruiter_id)
  VALUES ('NovaTech Labs', 'https://novatech.io', 'Artificial Intelligence', 'Seattle, WA', @new_user_id);

  COMMIT;
  ```

---

### Exercise 10: Database Normalization (1NF, 2NF, 3NF, BCNF)
* **Concept:** Eliminating data redundancy and update anomalies.
* **Analysis:**
  * **1NF (First Normal Form):** Every column contains atomic values. (e.g. `jobs.requirements` or `users.email`).
  * **2NF (Second Normal Form):** In 1NF and all non-key attributes are fully functionally dependent on the entire primary key. In `saved_jobs`, `candidate_id` and `job_id` form a composite relationship, avoiding partial dependencies.
  * **3NF (Third Normal Form):** In 2NF and contains no transitive dependencies ($A \rightarrow B, B \rightarrow C$). Notice that company details (`company_name`, `company_location`) are stored in the `companies` table, not redundantly duplicated on every `job` record.

---

## Part 2: Document Database Exercises (MongoDB 7)

### Exercise 1: Insert and Find Documents
* **Concept:** BSON document insertion and querying.
* **Problem:** Find candidate profile by `userId`.
* **Runnable Command (mongosh / Compass):**
  ```javascript
  // Find candidate profile
  db.candidate_profiles.findOne({ userId: 3 });

  // Find all profiles containing 'Java 21' in their skills
  db.candidate_profiles.find({ skills: "Java 21" });
  ```

---

### Exercise 2: Update and Delete Documents
* **Concept:** Atomic update operators (`$set`, `$push`, `$pull`).
* **Problem:** Add a new skill to candidate #3's skills array without duplicating existing elements.
* **Runnable Command:**
  ```javascript
  db.candidate_profiles.updateOne(
    { userId: 3 },
    { $addToSet: { skills: "Kubernetes" }, $set: { updatedAt: new Date() } }
  );
  ```

---

### Exercise 3: Array Filtering and Nested Document Updates
* **Concept:** Manipulating sub-document arrays.
* **Problem:** Add a new certification item into the candidate's `certifications` array.
* **Runnable Command:**
  ```javascript
  db.candidate_profiles.updateOne(
    { userId: 3 },
    { 
      $push: { 
        certifications: {
          name: "AWS Certified Solutions Architect",
          issuingOrganization: "Amazon Web Services",
          issueDate: "2024"
        }
      }
    }
  );
  ```

---

### Exercise 4: Comparison and Logical Operators
* **Concept:** `$gt`, `$gte`, `$in`, `$or`, `$and`.
* **Problem:** Find interview feedback documents where the candidate was rated 4 or 5 stars in either a "Technical" or "Architecture" round.
* **Runnable Command:**
  ```javascript
  db.interview_feedback.find({
    rating: { $gte: 4 },
    $or: [
      { interviewRound: { $regex: /technical/i } },
      { interviewRound: { $regex: /architecture/i } }
    ]
  });
  ```

---

### Exercise 5: Aggregation Pipeline - Popular Skills
* **Concept:** Multi-stage aggregation pipelines (`$match`, `$unwind`, `$group`, `$sort`, `$limit`).
* **Problem:** Determine the top 5 most frequently listed candidate skills across the platform.
* **Runnable Command:**
  ```javascript
  db.candidate_profiles.aggregate([
    { $unwind: "$skills" },
    { $group: { _id: "$skills", totalCandidates: { $sum: 1 } } },
    { $sort: { totalCandidates: -1 } },
    { $limit: 5 }
  ]);
  ```

---

### Exercise 6: Aggregation Pipeline - Trending Search Analysis
* **Concept:** Grouping text searches to compute platform demand trends.
* **Problem:** Compute top 5 most searched job keywords.
* **Runnable Command:**
  ```javascript
  db.search_history.aggregate([
    { $match: { keyword: { $ne: null, $ne: "" } } },
    { $group: { _id: { $toLower: "$keyword" }, searchCount: { $sum: 1 } } },
    { $sort: { searchCount: -1 } },
    { $limit: 5 }
  ]);
  ```

---

### Exercise 7: Compound and Unique Indexes
* **Concept:** Preventing duplicate MongoDB records and accelerating compound filter queries.
* **Problem:** Create unique index on `userId` in `candidate_profiles` and an index on `applicationId` in `interview_feedback`.
* **Runnable Command:**
  ```javascript
  db.candidate_profiles.createIndex({ userId: 1 }, { unique: true });
  db.interview_feedback.createIndex({ applicationId: 1, createdAt: -1 });
  ```

---

### Exercise 8: Flexible Document Schema Design
* **Concept:** Polymorphism and schema evolution in NoSQL.
* **Architecture Insight:** A candidate's profile can include an arbitrary number of project URLs, custom resume metadata (`fileSize`, `mimeType`, `s3Key`), and variable education items without requiring database schema alters (`ALTER TABLE`), unlike rigid relational tables.

---

### Exercise 9: Activity Logs & Audit Querying
* **Concept:** Log ingestion and chronological inspection.
* **Problem:** Inspect the 10 most recent administrative and security actions.
* **Runnable Command:**
  ```javascript
  db.activity_logs.find().sort({ timestamp: -1 }).limit(10);
  ```

---

### Exercise 10: SQL vs. NoSQL Trade-off Matrix
| Dimension | MySQL (Relational) | MongoDB (Document) | SmartHire Implementation |
| :--- | :--- | :--- | :--- |
| **Data Model** | Strict tabular schema (Normalized tables) | Flexible JSON-like BSON documents | Hybrid: Relational core + Document satellites |
| **Integrity** | Foreign keys, ACID transactions, Unique constraints | Schema-less by default, Application-level validation | MySQL ensures single application per job (`uq_job_candidate`) |
| **Complex Queries** | Multi-table relational JOINs | Embedded documents & Aggregation pipelines | SQL handles jobs & companies; MongoDB aggregates top skills |
| **Best Suited For** | Financials, applications, authentication, access control | Unstructured portfolios, feedback, telemetry, search logs | User accounts in MySQL; Resumes and feedback in MongoDB |

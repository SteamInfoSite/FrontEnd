package kr.ac.ync.Movie.repository;

import kr.ac.ync.Movie.domain.Movie;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface MovieRepository extends JpaRepository<Movie, Long> {
    List<Movie> findByIsPopular(boolean isPopular);
}

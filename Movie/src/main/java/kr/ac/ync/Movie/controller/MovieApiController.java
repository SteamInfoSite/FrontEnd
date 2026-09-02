package kr.ac.ync.Movie.controller;


import kr.ac.ync.Movie.domain.Movie;
import kr.ac.ync.Movie.dto.MovieRequestDto;
import kr.ac.ync.Movie.service.MovieService;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/movies")
@RequiredArgsConstructor
public class MovieApiController {
    private final MovieService movieService;

    @PostMapping
    public ResponseEntity<Movie> createMovie(@RequestBody MovieRequestDto dto){
        return ResponseEntity.ok(movieService.savedMovie(dto));
    }

    @GetMapping
    public ResponseEntity<List<Movie>> getAllMovies(){
        return ResponseEntity.ok(movieService.findAllMovies());
    }

    // [R] 영화 상세 조회 (GET)
    @GetMapping("/{id}")
    public ResponseEntity<Movie> getMovieById(@PathVariable Long id) {
        return ResponseEntity.ok(movieService.findMovieById(id));
    }

    // [U] 영화 수정 (PUT)
    @PutMapping("/{id}")
    public ResponseEntity<Movie> updateMovie(@PathVariable Long id, @RequestBody MovieRequestDto dto) {
        return ResponseEntity.ok(movieService.updateMovie(id, dto));
    }

    // [D] 영화 삭제 (DELETE)
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteMovie(@PathVariable Long id) {
        movieService.deleteMovie(id);
        return ResponseEntity.ok("영화가 성공적으로 삭제되었습니다. id=" + id);
    }
}

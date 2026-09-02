package kr.ac.ync.Movie.dto;


import kr.ac.ync.Movie.domain.Movie;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class MovieRequestDto {
    private String title;
    private String posterUrl;
    private boolean isPopular;

    public Movie toEntity(){
        Movie movie = new Movie();
        movie.setTitle(this.title);
        movie.setPosterUrl(this.posterUrl);
        movie.setPopular(this.isPopular);
        return movie;
    }
}

package kr.ac.ync.Movie.dto;

import kr.ac.ync.Movie.domain.Banner;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class BannerRequestDto {
    private String title;
    private String imageUrl;
    private String linkUrl;
    private String bannerType;
    private Integer sortOrder;

    // DTO -> Entity 변환 메서드
    public Banner toEntity() {
        Banner banner = new Banner();
        banner.setTitle(this.title);
        banner.setImageUrl(this.imageUrl);
        banner.setLinkUrl(this.linkUrl);
        banner.setBannerType(this.bannerType);
        banner.setSortOrder(this.sortOrder);
        return banner;
    }
}
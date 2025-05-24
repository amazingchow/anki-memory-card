from datetime import datetime, timedelta

# 艾宾浩斯遗忘曲线间隔（小时）
EBINGHAUS_INTERVALS = [
    5/60,      # 5分钟
    30/60,     # 30分钟
    12,        # 12小时
    24,        # 1天
    48,        # 2天
    72,        # 3天
    120,       # 5天
    168,       # 7天
    336,       # 14天
    720,       # 30天
    1440,      # 60天
    2880,      # 120天
]

def calculate_next_review(review_count: int, rating: int) -> datetime:
    """
    根据复习次数和评分计算下次复习时间
    
    Args:
        review_count: 当前复习次数
        rating: 评分（1-5）
    
    Returns:
        下次复习时间
    """
    if review_count >= len(EBINGHAUS_INTERVALS):
        # 如果超过预设间隔，使用最后一个间隔
        interval = EBINGHAUS_INTERVALS[-1]
    else:
        interval = EBINGHAUS_INTERVALS[review_count]
    
    # 根据评分调整间隔
    if rating >= 4:  # 记得很好
        interval *= 1.5
    elif rating <= 2:  # 记得不好
        interval *= 0.5
    
    # 确保间隔至少为1小时
    interval = max(1, interval)
    
    return datetime.now() + timedelta(hours=interval)

def get_review_status(review_count: int) -> str:
    """
    根据复习次数获取卡片状态
    
    Args:
        review_count: 当前复习次数
    
    Returns:
        卡片状态：learning, reviewing, mastered
    """
    if review_count == 0:
        return "learning"
    elif review_count < 5:
        return "reviewing"
    else:
        return "mastered" 